import assert from 'node:assert/strict';
import { createHash, generateKeyPairSync, sign } from 'node:crypto';
import test from 'node:test';
import { createPersonaModelAuthorizer } from '../server/src/persona-model-access.js';

function fixture() {
  const ids = Array.from({ length: 7 }, (_, index) => `00000000-0000-0000-0000-00000000000${index + 1}`);
  const [tenantUid, personaInstanceUid, bindingId, passportId, activationUid, leaseUid, nonce] = ids;
  const scope = { tenantUid, personaInstanceUid, bindingId, passportId, activationUid, leaseUid,
    accountId: '123', operation: 'publish' };
  const audience = 'https://1db.example';
  const time = 1_800_000_000_000;
  const pair = generateKeyPairSync('ec', { namedCurve: 'prime256v1' });
  const authority = { ...scope, allowed: true, expiresAt: time + 10_000,
    runtimePublicKeySpki: pair.publicKey.export({ format: 'der', type: 'spki' }).toString('base64url') };
  const seen = new Set();
  const authorize = createPersonaModelAuthorizer({ audience, now: () => time,
    loadAuthority: async () => authority,
    consumeNonce: async ({ nonce: supplied }) => {
      if (seen.has(supplied)) return false;
      seen.add(supplied);
      return true;
    } });
  const method = 'POST';
  const path = `/v1/platform/applications/1db/tenants/${tenantUid}/persona-models/${personaInstanceUid}/123/publish`;
  const body = Buffer.from('{"expectedVersion":12}');
  const hash = createHash('sha256').update(body).digest('hex');
  const message = ['onedb.persona-memory.v1', audience, method, path, passportId, activationUid, leaseUid,
    bindingId, String(time), nonce, hash].join('\n');
  const signature = sign('sha256', Buffer.from(message), { key: pair.privateKey, dsaEncoding: 'ieee-p1363' }).toString('base64url');
  const headers = { 'x-persona-binding': bindingId, 'x-persona-passport': passportId, 'x-persona-activation': activationUid,
    'x-persona-lease': leaseUid, 'x-persona-nonce': nonce, 'x-persona-timestamp': String(time), 'x-persona-signature': signature };
  return { authorize, authority, signed: { method, path, body, headers }, scope };
}

test('accepts the exact signed request once', async () => {
  const { authorize, signed, scope } = fixture();
  assert.deepEqual(await authorize(signed), scope);
  await assert.rejects(authorize(signed), { status: 403 });
});

test('rejects changes to the account, operation, or raw request body', async () => {
  const { authorize, signed } = fixture();
  await assert.rejects(authorize({ ...signed, path: signed.path.replace('/123/', '/124/') }), { status: 403 });
  await assert.rejects(authorize({ ...signed, path: signed.path.replace('/publish', '/claim') }), { status: 403 });
  await assert.rejects(authorize({ ...signed, body: Buffer.from('{"expectedVersion":13}') }), { status: 403 });
  await authorize(signed);
});

test('checks current authority even when the runtime signature is still valid', async () => {
  const { authorize, signed, authority } = fixture();
  authority.allowed = false;
  await assert.rejects(authorize(signed), { status: 403 });
  authority.allowed = true;
  authority.expiresAt = 1_799_999_999_999;
  await assert.rejects(authorize(signed), { status: 403 });
});
