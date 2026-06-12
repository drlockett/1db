import { createServer } from 'node:http';
import { randomUUID } from 'node:crypto';
import {
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
const appKey = process.env.ONE_DB_APPLICATION_KEY || '1db';

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
    'access-control-allow-headers': 'content-type,authorization,x-api-key,x-nrun-tenant-uid,x-1db-tenant-uid,idempotency-key',
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

async function readBody(req) {
  const chunks = [];
  for await (const chunk of req) chunks.push(chunk);
  const text = Buffer.concat(chunks).toString('utf8');
  if (!text) return { text: '', json: null };
  try {
    return { text, json: JSON.parse(text) };
  } catch {
    return { text, json: null };
  }
}

function tenantUidFrom(req, url, body) {
  return req.headers['x-nrun-tenant-uid']
    || req.headers['x-1db-tenant-uid']
    || url.searchParams.get('tenantUid')
    || body?.tenantUid
    || body?.tenant?.uid
    || '';
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

async function proxyCognition(req, res, url, parts) {
  const { json: bodyJson } = await readBody(req);
  const tenantUid = tenantUidFrom(req, url, bodyJson);
  if (!tenantUid) {
    return json(res, 400, {
      error: {
        code: 'tenant_required',
        message: 'Set X-NRun-Tenant-Uid, X-1db-Tenant-Uid, tenantUid query, or tenantUid body value.'
      }
    });
  }

  const path = cleanPath(parts.join('/'));
  const suffix = url.search ? url.search : '';
  const result = await sapi(
    `/platform/applications/${encodeURIComponent(appKey)}/tenants/${encodeURIComponent(tenantUid)}/cognition/${path}${suffix}`,
    {
      method: req.method,
      body: ['GET', 'HEAD'].includes(req.method) ? undefined : (bodyJson ?? {}),
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
    if (req.method === 'OPTIONS') return send(res, 204, '', corsFor(req));
    if (url.pathname === '/' && req.method === 'HEAD') return send(res, 200, '', { 'content-type': 'text/html; charset=utf-8', 'cache-control': 'no-store' });
    if (url.pathname === '/' && req.method === 'GET') return html(res, 200, homePage());
    if (url.pathname === '/docs' && req.method === 'GET') return html(res, 200, docsPage());
    if (url.pathname === '/signin' && req.method === 'GET') return html(res, 200, signInPage());
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
    if (url.pathname === '/health') return json(res, 200, { ok: true, service: '1db.io', mode: 'sapi-tala', time: new Date().toISOString() });
    if (url.pathname === '/ready') {
      const result = await sapi('/health', { timeoutMs: 5000 });
      return json(res, result.ok ? 200 : 503, { ok: result.ok, sapiStatus: result.status, service: '1db.io' });
    }
    if (url.pathname === '/openapi.json' && req.method === 'GET') return json(res, 200, openApiDocument(publicOrigin));
    if (url.pathname === '/api/v1/platform/manifest') {
      return json(res, 200, {
        applicationKey: appKey,
        applicationName: '1db',
        storagePolicy: 'NodeRunner managed persistence',
        canonicalTenantHeader: 'X-NRun-Tenant-Uid',
        cognitiveRoutes: [
          '/api/v1/cognition/events',
          '/api/v1/cognition/context/retrieve',
          '/api/v1/cognition/context/packets/{packetUid}',
          '/api/v1/cognition/backends',
          '/api/v1/cognition/backends/plan',
          '/api/v1/cognition/projects/{projectId}/continuity'
        ]
      });
    }
    const parts = url.pathname.split('/').filter(Boolean);
    if (parts[0] === 'api' && parts[1] === 'v1' && parts[2] === 'cognition') {
      return proxyCognition(req, res, url, parts.slice(3));
    }
    if (req.method === 'GET' && !url.pathname.startsWith('/api/')) return html(res, 404, notFoundPage());
    return json(res, 404, { error: { code: 'not_found', message: 'No route matched.' } });
  } catch (error) {
    return json(res, 500, { error: { code: 'server_error', message: error?.message || 'Unhandled 1db server error.' } });
  }
});

server.listen(port, '0.0.0.0', () => {
  console.log(`1db platform server listening on ${port}`);
});
