import { createHash, createPublicKey, verify } from 'node:crypto';

const uuid = /^[0-9a-f]{8}(?:-[0-9a-f]{4}){3}-[0-9a-f]{12}$/;
const route = /^\/v1\/platform\/applications\/1db\/tenants\/([0-9a-f-]+)\/persona-models\/([0-9a-f-]+)\/([1-9]\d{0,18})\/(head|claim|publish)$/;
const maximumSkewMs = 60_000;

function denied() {
  return Object.assign(new Error('Persona memory access denied.'), { status: 403 });
}

export function createPersonaModelAuthorizer({ audience, loadAuthority, consumeNonce, now = Date.now }) {
  const url = new URL(audience);
  if (url.protocol !== 'https:' || url.origin !== audience) throw new Error('Invalid persona memory audience.');

  return async function authorize({ method, path, headers, body }) {
    const match = route.exec(path);
    if (!match || method !== (match[4] === 'head' ? 'GET' : 'POST')) throw denied();
    const [, tenantUid, personaInstanceUid, accountId, operation] = match;
    const bindingId = headers['x-persona-binding'];
    const passportId = headers['x-persona-passport'];
    const activationUid = headers['x-persona-activation'];
    const leaseUid = headers['x-persona-lease'];
    const nonce = headers['x-persona-nonce'];
    const timestamp = headers['x-persona-timestamp'];
    const signature = headers['x-persona-signature'];
    const checkedAt = now();
    if (![tenantUid, personaInstanceUid, bindingId, passportId, activationUid, leaseUid, nonce]
      .every(value => typeof value === 'string' && uuid.test(value))
      || typeof timestamp !== 'string' || !/^\d{13}$/.test(timestamp) || Math.abs(checkedAt - Number(timestamp)) > maximumSkewMs
      || typeof signature !== 'string' || !/^[A-Za-z0-9_-]{86}$/.test(signature)
      || !Buffer.isBuffer(body) || (operation === 'head' ? body.length !== 0 : !body.length || body.length > 100_000)) throw denied();

    const scope = { tenantUid, personaInstanceUid, accountId, operation, bindingId, passportId, activationUid, leaseUid };
    // Resolve from current authoritative passport, binding, lease, and grant state together.
    const authority = await loadAuthority(scope);
    if (authority?.allowed !== true || Object.entries(scope).some(([key, value]) => authority[key] !== value)
      || !Number.isFinite(authority.expiresAt) || authority.expiresAt <= now()) throw denied();

    const hash = createHash('sha256').update(body).digest('hex');
    const bytes = Buffer.from(['onedb.persona-memory.v1', audience, method, path, passportId, activationUid, leaseUid,
      bindingId, timestamp, nonce, hash].join('\n'));
    let valid = false;
    try {
      const key = createPublicKey({ key: Buffer.from(authority.runtimePublicKeySpki, 'base64url'), format: 'der', type: 'spki' });
      valid = key.asymmetricKeyType === 'ec' && key.asymmetricKeyDetails?.namedCurve === 'prime256v1'
        && verify('sha256', bytes, { key, dsaEncoding: 'ieee-p1363' }, Buffer.from(signature, 'base64url'));
    } catch { throw denied(); }
    const expiresAt = Number(timestamp) + maximumSkewMs + 1;
    if (!valid || expiresAt <= now() || !await consumeNonce({ tenantUid, bindingId, nonce, expiresAt })) throw denied();
    return Object.freeze(scope);
  };
}
