import { createServer } from 'node:http';
import { createHmac, randomUUID, timingSafeEqual } from 'node:crypto';
import { authorizeMemoryRequest, bindMemoryRequest, canReadMemoryPacket, MemoryAccessError, requireContinuityAccess } from './memory-access.js';
import { createPersonaModelAuthorizer } from './persona-model-access.js';
import { readFile } from 'node:fs/promises';
import { dirname, join, normalize } from 'node:path';
import { fileURLToPath } from 'node:url';
import {
  adminPage,
  docsPage,
  homePage,
  notFoundPage,
  openApiDocument,
  signInPage,
  waitlistPage,
  waitlistThanksPage
} from './pages.js';

const port = Number(process.env.PORT || 8080);
const publicOrigin = process.env.PUBLIC_ORIGIN || 'https://1db.io';
const sapiBase = (process.env.SAPI_BASE_URL || 'https://sapi.nrun.ws/v1').replace(/\/$/, '');
const sapiToken = process.env.SAPI_SERVICE_TOKEN || process.env.NRUN_SAPI_SERVICE_TOKEN || '';
const personaGatewayToken = process.env.ONE_DB_PERSONA_GATEWAY_TOKEN || '';
const appKey = process.env.ONE_DB_APPLICATION_KEY || '1db';
const oneDbApplicationId = Number(process.env.ONE_DB_APPLICATION_ID || 20005);
const sessionSecret = process.env.ONE_DB_SESSION_SECRET || process.env.SESSION_SECRET || sapiToken;
const publicDir = normalize(join(dirname(fileURLToPath(import.meta.url)), '..', 'public'));

const allowedOrigins = new Set([
  publicOrigin,
  'https://1db.io',
  'https://www.1db.io'
]);

function corsFor(req) {
  const origin = req.headers.origin;
  const allowOrigin = allowedOrigins.has(origin) ? origin : publicOrigin;
  return {
    'access-control-allow-origin': allowOrigin,
    'vary': 'Origin',
    'access-control-allow-methods': 'GET,POST,PATCH,DELETE,OPTIONS,HEAD',
    'access-control-allow-headers': 'content-type,authorization,x-api-key,x-nrun-tenant-uid,x-1db-tenant-uid,x-nrun-sapi-token,idempotency-key',
    'access-control-allow-credentials': 'true'
  };
}

const securityHeaders = {
  'x-content-type-options': 'nosniff',
  'referrer-policy': 'strict-origin-when-cross-origin',
  'permissions-policy': 'geolocation=(), microphone=(), camera=()'
};

function send(res, status, body, headers = {}) {
  res.writeHead(status, { ...securityHeaders, ...headers });
  res.end(body);
}

function json(res, status, data, headers = {}) {
  send(res, status, JSON.stringify(data, null, 2), {
    'content-type': 'application/json; charset=utf-8',
    'cache-control': 'no-store',
    ...corsFor(res.req),
    ...headers
  });
}

function html(res, status, body) {
  send(res, status, body, {
    'content-type': 'text/html; charset=utf-8',
    'cache-control': 'no-store'
  });
}

async function asset(res, name, contentType, head = false) {
  const path = normalize(join(publicDir, name));
  if (!path.startsWith(publicDir)) return send(res, 404, '', { 'cache-control': 'no-store' });
  try {
    const body = await readFile(path);
    return send(res, 200, head ? '' : body, {
      'content-type': contentType,
      'content-length': body.length,
      'cache-control': 'public, max-age=31536000, immutable'
    });
  } catch {
    return send(res, 404, '', { 'cache-control': 'no-store' });
  }
}

function redirect(res, location, headers = {}) {
  send(res, 303, '', { location, ...headers });
}

function parseForm(text) {
  const params = new URLSearchParams(text || '');
  return Object.fromEntries(params.entries());
}

function cleanPath(value) {
  return String(value || '')
    .split('/')
    .filter(Boolean)
    .map(part => encodeURIComponent(decodeURIComponent(part)))
    .join('/');
}

function parseCookies(req) {
  return Object.fromEntries(String(req.headers.cookie || '')
    .split(';')
    .map(part => part.trim())
    .filter(Boolean)
    .map(part => {
      const index = part.indexOf('=');
      return index < 0 ? [part, ''] : [part.slice(0, index), decodeURIComponent(part.slice(index + 1))];
    }));
}

function signSession(payload) {
  if (!sessionSecret) throw new MemoryAccessError(503, 'sign_in_unavailable', 'Sign-in is unavailable.');
  const encoded = Buffer.from(JSON.stringify(payload)).toString('base64url');
  const signature = createHmac('sha256', sessionSecret).update(encoded).digest('base64url');
  return `${encoded}.${signature}`;
}

function readSession(req) {
  if (!sessionSecret) return null;
  let cookie;
  try { cookie = parseCookies(req).one_db_session; } catch { return null; }
  if (!cookie || !cookie.includes('.')) return null;
  const [encoded, signature] = cookie.split('.', 2);
  const expected = createHmac('sha256', sessionSecret).update(encoded).digest('base64url');
  const actualBuffer = Buffer.from(signature);
  const expectedBuffer = Buffer.from(expected);
  if (actualBuffer.length !== expectedBuffer.length || !timingSafeEqual(actualBuffer, expectedBuffer)) return null;
  try {
    const payload = JSON.parse(Buffer.from(encoded, 'base64url').toString('utf8'));
    return payload.expires > Date.now() ? payload : null;
  } catch {
    return null;
  }
}

async function sessionCookie(account) {
  const tenantId = Number(account.tenantId ?? account.TenantId);
  const accountId = Number(account.id ?? account.Id);
  if (!Number.isSafeInteger(tenantId) || tenantId <= 0 || !Number.isSafeInteger(accountId) || accountId <= 0)
    throw new MemoryAccessError(503, 'sign_in_unavailable', 'The account tenant is unavailable.');
  const tenant = await sapi(`/platform/tenants/${tenantId}`);
  const canonicalTenantUid = tenant.data?.tenantUid ?? tenant.data?.TenantUid;
  if (!tenant.ok || !/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(canonicalTenantUid || ''))
    throw new MemoryAccessError(503, 'sign_in_unavailable', 'The account tenant is unavailable.');
  const payload = {
    accountId,
    tenantId,
    tenantUid: canonicalTenantUid.toLowerCase(),
    email: account.email || account.Email || account.userName || account.UserName || '',
    expires: Date.now() + 8 * 60 * 60 * 1000
  };
  return `one_db_session=${encodeURIComponent(signSession(payload))}; HttpOnly; Secure; SameSite=Lax; Path=/; Max-Age=28800`;
}

async function readBody(req, limit = 1024 * 1024) {
  const chunks = [];
  let bytes = 0;
  for await (const chunk of req) {
    bytes += chunk.length;
    if (bytes > limit) throw new MemoryAccessError(413, 'request_too_large', 'The request exceeds the size limit.');
    chunks.push(chunk);
  }
  const raw = Buffer.concat(chunks);
  const text = raw.toString('utf8');
  if (!text) return { text: '', json: null, raw };
  try {
    return { text, json: JSON.parse(text), raw };
  } catch {
    return { text, json: null, raw };
  }
}

async function modelAuthority(tenantUid, operation, body) {
  if (!sapiToken || !personaGatewayToken) throw new MemoryAccessError(503, 'memory_unavailable', 'Persona memory is unavailable.');
  const result = await sapi(`/platform/persona-model-authority/tenants/${tenantUid}/${operation}`,
    { method: 'POST', body, headers: { 'X-1db-Persona-Gateway': personaGatewayToken } });
  if (result.status >= 500 || result.status === 404 || result.status === 401)
    throw new MemoryAccessError(503, 'memory_unavailable', 'Persona memory is unavailable.');
  return result;
}

const authorizePersonaModel = createPersonaModelAuthorizer({ audience: new URL(publicOrigin).origin,
  loadAuthority: async ({ tenantUid, ...scope }) => (await modelAuthority(tenantUid, 'resolve', scope)).data,
  consumeNonce: async ({ tenantUid, ...nonce }) => (await modelAuthority(tenantUid, 'nonces', nonce)).status === 204 });

async function proxyPersonaModel(req, res) {
  const body = await readBody(req, 100_000);
  let scope;
  try { scope = await authorizePersonaModel({ method: req.method, path: req.url, headers: req.headers, body: body.raw }); }
  catch (error) {
    if (error.status === 403) throw new MemoryAccessError(403, 'persona_access_denied', 'Persona memory access denied.');
    throw error;
  }
  const { tenantUid, ...authorization } = scope;
  const result = await modelAuthority(tenantUid, 'model', { scope: authorization, parameters: body.json });
  if (result.status === 204) return send(res, 204, '', { 'cache-control': 'no-store' });
  return json(res, result.status, result.data);
}

async function sapi(path, { method = 'GET', body, headers = {}, timeoutMs = 15000 } = {}) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const response = await fetch(`${sapiBase}${path}`, {
      method,
      signal: controller.signal,
      headers: {
        accept: 'application/json',
        'content-type': 'application/json',
        ...(sapiToken ? { 'X-NRun-SAPI-Token': sapiToken } : {}),
        ...headers
      },
      body: body === undefined ? undefined : JSON.stringify(body)
    });
    const text = await response.text();
    let data = null;
    try {
      data = text ? JSON.parse(text) : null;
    } catch {
      data = text;
    }
    return { ok: response.ok, status: response.status, data };
  } finally {
    clearTimeout(timer);
  }
}

async function memoryAccess(req, url, body, parts) {
  return authorizeMemoryRequest(req, url, body, parts, {
    readSession, serviceToken: sapiToken, publicOrigin, allowedOrigins,
    validateToken: request => sapi(`/platform/applications/${encodeURIComponent(appKey)}/tenant-credentials/validate`, { method: 'POST', body: request })
  });
}

async function proxyCognition(req, res, url, parts) {
  const { json: bodyJson } = await readBody(req);
  const access = await memoryAccess(req, url, bodyJson, parts);
  requireContinuityAccess(parts, access);
  const tenantUid = access.tenantUid;
  const boundBody = bindMemoryRequest(bodyJson, access);
  const path = cleanPath(parts.join('/'));
  const suffix = url.search ? url.search : '';
  const result = await sapi(
    `/platform/applications/${encodeURIComponent(appKey)}/tenants/${encodeURIComponent(tenantUid)}/cognition/${path}${suffix}`,
    {
      method: req.method,
      body: ['GET', 'HEAD'].includes(req.method) ? undefined : boundBody,
      timeoutMs: path === 'seed' ? 120000 : 15000,
      headers: {
        'x-1db-request-id': req.headers['x-request-id'] || randomUUID(),
        ...(req.headers['idempotency-key'] ? { 'idempotency-key': req.headers['idempotency-key'] } : {})
      }
    }
  );
  if (result.ok && parts[0] === 'context' && parts[1] === 'packets' &&
      !canReadMemoryPacket(result.data?.packet ?? result.data?.Packet, access))
    throw new MemoryAccessError(403, 'scope_access_denied', 'This scoped context packet belongs to a different principal.');
  return json(res, result.status, result.data ?? {});
}

async function proxyProjectCognition(req, res, url, parts) {
  const { json: bodyJson } = await readBody(req);
  const access = await memoryAccess(req, url, bodyJson, parts);
  const tenantUid = access.tenantUid;
  const boundBody = bindMemoryRequest(bodyJson, access);
  const path = cleanPath(parts.join('/'));
  const suffix = `${path ? `/${path}` : ''}${url.search || ''}`;
  const result = await sapi(
    `/platform/applications/${encodeURIComponent(appKey)}/tenants/${encodeURIComponent(tenantUid)}/project-cognition${suffix}`,
    {
      method: req.method,
      body: ['GET', 'HEAD'].includes(req.method) ? undefined : boundBody,
      headers: {
        'x-1db-request-id': req.headers['x-request-id'] || randomUUID(),
        ...(req.headers['idempotency-key'] ? { 'idempotency-key': req.headers['idempotency-key'] } : {})
      }
    }
  );
  return json(res, result.status, result.data ?? {});
}

const server = createServer(async (req, res) => {
  try {
    res.req = req;
    const url = new URL(req.url || '/', publicOrigin);
    if (/^\/v1\/platform\/applications\/1db\/tenants\/[^/]+\/persona-models\//.test(url.pathname))
      return await proxyPersonaModel(req, res);
    if (req.method === 'OPTIONS') return send(res, 204, '', corsFor(req));
    if (url.pathname === '/' && req.method === 'HEAD') return send(res, 200, '', { 'content-type': 'text/html; charset=utf-8', 'cache-control': 'no-store' });
    if (url.pathname === '/' && req.method === 'GET') return html(res, 200, homePage());
    if (url.pathname === '/assets/learns.png' && ['GET', 'HEAD'].includes(req.method)) {
      return asset(res, 'learns.png', 'image/png', req.method === 'HEAD');
    }
    if (url.pathname === '/assets/cognition-graph.png' && ['GET', 'HEAD'].includes(req.method)) {
      return asset(res, 'cognition-graph.png', 'image/png', req.method === 'HEAD');
    }
    if (url.pathname === '/docs' && req.method === 'GET') return html(res, 200, docsPage());
    if (url.pathname === '/signin' && req.method === 'GET') return html(res, 200, signInPage());
    if (url.pathname === '/signin' && req.method === 'POST') {
      const { text } = await readBody(req);
      const form = parseForm(text);
      const email = String(form.email || '').trim();
      const password = String(form.password || '');
      if (!email || !password) return html(res, 400, signInPage('Enter your email and password.'));
      const result = await sapi('/accounts/login', {
        method: 'POST',
        body: {
          userName: email,
          password,
          applicationId: oneDbApplicationId,
          ipAddress: req.headers['x-forwarded-for'] || req.socket.remoteAddress || '',
          userAgent: req.headers['user-agent'] || '',
          returnUrl: '/admin'
        }
      });
      if (!result.ok || !result.data) return html(res, 401, signInPage('Invalid email or password.'));
      return redirect(res, '/admin', { 'set-cookie': await sessionCookie(result.data) });
    }
    if (url.pathname === '/signout' && req.method === 'POST') {
      return redirect(res, '/', { 'set-cookie': 'one_db_session=; HttpOnly; Secure; SameSite=Lax; Path=/; Max-Age=0' });
    }
    if (url.pathname === '/account' && req.method === 'GET') {
      return redirect(res, '/admin');
    }
    if (url.pathname === '/admin' && req.method === 'GET') {
      const session = readSession(req);
      if (!session) return redirect(res, '/signin');
      return html(res, 200, adminPage(session));
    }
    if (url.pathname === '/waitlist' && req.method === 'GET') return html(res, 200, waitlistPage());
    if (url.pathname === '/waitlist' && req.method === 'POST') {
      const { text } = await readBody(req);
      const form = parseForm(text);
      if (form.website) return html(res, 200, waitlistThanksPage());
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(form.email || '').trim())) {
        return html(res, 400, waitlistPage('Enter a valid email.'));
      }
      return html(res, 202, waitlistThanksPage());
    }
    if (url.pathname === '/health') return json(res, 200, { ok: true, service: '1db.io', time: new Date().toISOString() });
    if (url.pathname === '/ready') {
      const result = await sapi('/health', { timeoutMs: 5000 });
      return json(res, result.ok ? 200 : 503, { ok: result.ok, service: '1db.io' });
    }
    if (url.pathname === '/openapi.json' && req.method === 'GET') return json(res, 200, openApiDocument(publicOrigin));
    if (url.pathname === '/api/v1/platform/manifest') {
      return json(res, 200, {
        applicationKey: appKey,
        applicationName: '1db',
        storagePolicy: 'Managed persistence',
        canonicalTenantHeader: 'X-NRun-Tenant-Uid',
        cognitiveRoutes: [
          '/1db/cognition',
          '/1db/cognition/cam',
          '/api/v1/cam',
          '/api/v1/cam/associations',
          '/api/v1/cam/observe',
          '/api/v1/cam/reinforce/{associationId}',
          '/1db/cognition/concepts/{conceptId}',
          '/1db/cognition/concepts/by-label/{label}',
          '/1db/cognition/associations/{associationId}',
          '/1db/cognition/decompose/{conceptId}',
          '/1db/cognition/rules/{ruleId}',
          '/1db/cognition/sessions/{sessionId}',
          '/1db/cognition/infer',
          '/api/v1/cognition/events',
          '/api/v1/cognition/context/retrieve',
          '/api/v1/cognition/context/packets/{packetUid}',
          '/api/v1/cognition/graph',
          '/api/v1/cognition/cam',
          '/api/v1/cognition/cam/associations',
          '/api/v1/cognition/cam/observe',
          '/api/v1/cognition/cam/reinforce/{associationId}',
          '/api/v1/cognition/stats',
          '/api/v1/cognition/seed',
          '/api/v1/cognition/query/{query}',
          '/api/v1/cognition/concepts/{conceptId}',
          '/api/v1/cognition/concepts/by-label/{label}',
          '/api/v1/cognition/associations/{associationId}',
          '/api/v1/cognition/decompose/{conceptId}',
          '/api/v1/cognition/rules/{ruleId}',
          '/api/v1/cognition/sessions/{sessionId}',
          '/api/v1/cognition/infer',
          '/api/v1/cognition/seed/jobs/{jobId}',
          '/api/v1/cognition/enrichment/jobs/{jobId}',
          '/api/v1/cognition/evidence/{evidenceId}',
          '/api/v1/cognition/backends',
          '/api/v1/cognition/backends/plan',
          '/api/v1/cognition/projects/{projectId}/continuity',
          '/api/v1/cognition/continuity/{scopeType}/{scopeId}',
          '/api/v1/cognition/continuity/{scopeType}/{scopeId}/checkpoints',
          '/api/project-cognition',
          '/api/project-cognition/{projectKey}',
          '/api/project-cognition/{projectKey}/active'
        ]
      });
    }
    const parts = url.pathname.split('/').filter(Boolean);
    if (parts[0] === 'api' && parts[1] === 'project-cognition') {
      return await proxyProjectCognition(req, res, url, parts.slice(2));
    }
    if (parts[0] === 'api' && parts[1] === 'v1' && parts[2] === 'project-cognition') {
      return await proxyProjectCognition(req, res, url, parts.slice(3));
    }
    if (parts[0] === 'api' && parts[1] === 'v1' && parts[2] === 'cognition') {
      return await proxyCognition(req, res, url, parts.slice(3));
    }
    if (parts[0] === 'api' && parts[1] === 'v1' && parts[2] === 'cam') {
      return await proxyCognition(req, res, url, ['cam', ...parts.slice(3)]);
    }
    if (parts[0] === '1db' && parts[1] === 'cognition') {
      const cognitionParts = parts.length === 2 ? ['graph'] : parts.slice(2);
      return await proxyCognition(req, res, url, cognitionParts);
    }
    if (req.method === 'GET' && !url.pathname.startsWith('/api/')) return html(res, 404, notFoundPage());
    return json(res, 404, { error: { code: 'not_found', message: 'No route matched.' } });
  } catch (error) {
    if (error instanceof MemoryAccessError) return json(res, error.status, { error: { code: error.code, message: error.message } });
    return json(res, 500, { error: { code: 'server_error', message: 'The request could not be completed.' } });
  }
});

server.listen(port, '0.0.0.0', () => {
  console.log(`1db platform server listening on ${server.address().port}`);
});
