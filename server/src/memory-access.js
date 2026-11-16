import { createHash, timingSafeEqual } from 'node:crypto';

const uuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const value = (object, key) => object?.[key] ?? object?.[key[0].toUpperCase() + key.slice(1)];

export class MemoryAccessError extends Error {
  constructor(status, code, message) { super(message); this.status = status; this.code = code; }
}

export function constantTimeTokenEquals(supplied, expected) {
  if (typeof supplied !== 'string' || typeof expected !== 'string' || !supplied || !expected) return false;
  const hash = text => createHash('sha256').update(text).digest();
  return timingSafeEqual(hash(supplied), hash(expected));
}

export function requestedTenant(req, url, body) {
  const candidates = [req.headers['x-nrun-tenant-uid'], req.headers['x-1db-tenant-uid'],
    ...url.searchParams.getAll('tenantUid'), body?.tenantUid, body?.tenant?.uid]
    .filter(item => item !== undefined && item !== null && item !== '');
  if (candidates.some(item => typeof item !== 'string' || !uuid.test(item)))
    throw new MemoryAccessError(400, 'invalid_tenant', 'Supply one canonical tenant identifier.');
  const tenants = [...new Set(candidates.map(item => item.toLowerCase()))];
  if (tenants.length > 1) throw new MemoryAccessError(403, 'tenant_mismatch', 'Tenant identifiers disagree.');
  return tenants[0] || null;
}

export function requiredMemoryScope(method, parts) {
  const read = ['GET', 'HEAD'].includes(method) || (method === 'POST' && parts.join('/') === 'context/retrieve');
  return read ? 'cognition:read' : 'cognition:write';
}

export function requireContinuityAccess(parts, access) {
  if (access.trustedService) return;
  const path = parts.flatMap(part => decodeURIComponent(part).split('/')).map(part => part.trim().toLowerCase());
  if (path[0] === 'continuity' && path[1] === 'engagement' && path[2]?.startsWith('syn-persona-imprint-v1-'))
    throw new MemoryAccessError(403, 'scope_access_denied', 'A service credential is required for this continuity scope.');
}

// The platform API authenticates this app separately. A caller's tenant selection
// never becomes caller authentication, and request JSON never supplies this context.
export async function authorizeMemoryRequest(req, url, body, parts, options) {
  const selectedTenant = requestedTenant(req, url, body);
  const authorization = req.headers.authorization;
  const apiKey = req.headers['x-api-key'];
  const serviceHeader = req.headers['x-nrun-sapi-token'];
  let bearer;
  if (authorization !== undefined) {
    const match = typeof authorization === 'string' && /^Bearer ([^\s]+)$/i.exec(authorization);
    if (!match) throw new MemoryAccessError(401, 'unauthorized', 'A valid credential is required.');
    bearer = match[1];
  }
  if (apiKey !== undefined && (typeof apiKey !== 'string' || !apiKey || (bearer && apiKey !== bearer)))
    throw new MemoryAccessError(401, 'unauthorized', 'Supply one valid credential.');
  const token = bearer || apiKey;
  if (serviceHeader !== undefined || (token && constantTimeTokenEquals(token, options.serviceToken))) {
    if ((serviceHeader !== undefined && !constantTimeTokenEquals(serviceHeader, options.serviceToken)) ||
        (token && !constantTimeTokenEquals(token, options.serviceToken)))
      throw new MemoryAccessError(401, 'unauthorized', 'The service credential is invalid.');
    if (!selectedTenant) throw new MemoryAccessError(400, 'tenant_required', 'A tenant identifier is required for service requests.');
    return { tenantUid: selectedTenant, principalId: 'service:1db', trustedService: true };
  }
  if (token) {
    if (token.length > 4096) throw new MemoryAccessError(401, 'unauthorized', 'The credential is invalid.');
    const scope = requiredMemoryScope(req.method, parts);
    let result;
    try {
      result = await options.validateToken({ token, requiredScope: scope, resourcePath: url.pathname,
        requestId: String(req.headers['x-request-id'] || '').slice(0, 128) || undefined });
    } catch {
      throw new MemoryAccessError(503, 'authentication_unavailable', 'Credential verification is unavailable.');
    }
    if (!result.ok) throw new MemoryAccessError(result.status >= 500 ? 503 : 401, 'authentication_unavailable', 'Credential verification is unavailable.');
    const principal = result.data;
    if (value(principal, 'isValid') !== true) {
      const denied = value(principal, 'status') === 'scope_denied';
      throw new MemoryAccessError(denied ? 403 : 401, denied ? 'scope_denied' : 'unauthorized', 'The credential does not authorize this request.');
    }
    const tenantUid = String(value(principal, 'tenantUid') || '').toLowerCase();
    const scopes = value(principal, 'scopes');
    if (!uuid.test(tenantUid) || value(principal, 'applicationCode')?.toLowerCase() !== '1db' ||
        !Array.isArray(scopes) || !scopes.some(item => String(item).toLowerCase() === scope))
      throw new MemoryAccessError(403, 'scope_denied', 'The credential does not authorize this request.');
    if (selectedTenant && selectedTenant !== tenantUid)
      throw new MemoryAccessError(403, 'tenant_mismatch', 'The credential does not authorize the selected tenant.');
    const credentialId = value(principal, 'credentialId');
    if (!Number.isSafeInteger(credentialId) || credentialId <= 0)
      throw new MemoryAccessError(401, 'unauthorized', 'The credential identity is unavailable.');
    return { tenantUid, principalId: `credential:${credentialId}`, trustedService: false };
  }
  const session = options.readSession(req);
  if (!session || !uuid.test(session.tenantUid || '') || !Number.isSafeInteger(session.accountId) || session.accountId <= 0)
    throw new MemoryAccessError(401, 'unauthorized', 'Sign in or provide an application credential.');
  const tenantUid = session.tenantUid.toLowerCase();
  if (selectedTenant && selectedTenant !== tenantUid)
    throw new MemoryAccessError(403, 'tenant_mismatch', 'The session does not authorize the selected tenant.');
  if (!['GET', 'HEAD'].includes(req.method) && !(options.allowedOrigins ?? new Set([options.publicOrigin])).has(req.headers.origin))
    throw new MemoryAccessError(403, 'origin_denied', 'Use the signed-in application to submit this request.');
  return { tenantUid, principalId: `account:${session.accountId}`, trustedService: false };
}

export function bindMemoryRequest(body, access) {
  const safe = Object.fromEntries(Object.entries(body && typeof body === 'object' && !Array.isArray(body) ? body : {})
    .filter(([key]) => !['accesscontext', 'actorid'].includes(key.toLowerCase())));
  return { ...safe,
    actorId: access.trustedService ? (body?.actorId || access.principalId) : access.principalId,
    accessContext: { tenantUid: access.tenantUid, principalId: access.principalId, trustedService: access.trustedService } };
}

export function canReadMemoryPacket(packet, access) {
  if (access.trustedService) return true;
  const contexts = value(packet, 'scopeContexts');
  // Historical packets held only tenant project context. New scoped exports are
  // bound to the verified principal that requested them, including readback.
  if (!Array.isArray(contexts) || !contexts.some(item => value(item, 'scopeType') !== 'project')) return true;
  const owner = value(packet, 'accessContext');
  return value(owner, 'tenantUid')?.toLowerCase() === access.tenantUid && value(owner, 'principalId') === access.principalId;
}
