import assert from 'node:assert/strict';
import test from 'node:test';
import { authorizeMemoryRequest, bindMemoryRequest, canReadMemoryPacket, constantTimeTokenEquals, requiredMemoryScope } from '../server/src/memory-access.js';

const tenant = '11111111-1111-4111-8111-111111111111';
const other = '22222222-2222-4222-8222-222222222222';
const url = new URL('https://1db.io/api/v1/cognition/context/retrieve');
const session = { tenantUid: tenant, accountId: 7 };
const request = (headers = {}, method = 'GET') => ({ headers, method });
const options = (overrides = {}) => ({ readSession: () => session, serviceToken: 'private-service-token', publicOrigin: 'https://1db.io',
  validateToken: async () => { throw new Error('Unexpected token validation'); }, ...overrides });
const principal = { isValid: true, applicationCode: '1db', tenantUid: tenant, credentialId: 9, scopes: ['cognition:read'] };

test('anonymous tenant selection is not authentication and never reaches verification', async () => {
  for (const req of [request({'x-nrun-tenant-uid':tenant}), request({'x-1db-tenant-uid':tenant})])
    await assert.rejects(authorizeMemoryRequest(req, url, {accessContext:{trustedService:true}}, [], options({readSession:()=>null})), {status:401});
});

test('signed sessions cannot override their tenant by header, query, body or nested tenant', async () => {
  const attempts = [
    [request({'x-nrun-tenant-uid':other}),url,{}],
    [request(),new URL(`${url}?tenantUid=${other}`),{}],
    [request(),url,{tenantUid:other}],
    [request(),url,{tenant:{uid:other}}]
  ];
  for (const [req, address, body] of attempts)
    await assert.rejects(authorizeMemoryRequest(req,address,body,[],options()),{status:403,code:'tenant_mismatch'});
  const allowed = await authorizeMemoryRequest(request(),url,{},[],options());
  assert.equal(allowed.tenantUid,tenant);
  assert.equal(allowed.principalId,'account:7');
});

test('tenant selectors must agree, including duplicate query values and legacy headers', async () => {
  await assert.rejects(authorizeMemoryRequest(request({'x-nrun-tenant-uid':tenant,'x-1db-tenant-uid':other}),url,{},[],options()),{status:403});
  await assert.rejects(authorizeMemoryRequest(request(),new URL(`${url}?tenantUid=${tenant}&tenantUid=${other}`),{},[],options()),{status:403});
  await assert.rejects(authorizeMemoryRequest(request({'x-nrun-tenant-uid':['bad','bad']}),url,{},[],options()),{status:400});
});

test('service credentials stay supported with explicit tenant and constant-time digest comparison', async () => {
  assert.equal(constantTimeTokenEquals('private-service-token','private-service-token'),true);
  assert.equal(constantTimeTokenEquals('wrong','private-service-token'),false);
  assert.equal(constantTimeTokenEquals('',''),false);
  for (const headers of [{'x-nrun-sapi-token':'private-service-token'},{authorization:'Bearer private-service-token'}]) {
    const access = await authorizeMemoryRequest(request({...headers,'x-nrun-tenant-uid':tenant}),url,{},[],options({readSession:()=>null}));
    assert.equal(access.trustedService,true);
    assert.equal(access.tenantUid,tenant);
  }
  await assert.rejects(authorizeMemoryRequest(request({'x-nrun-sapi-token':'private-service-token'}),url,{},[],options()),{status:400});
});

test('explicit invalid credentials cannot fall back to a valid browser session', async () => {
  await assert.rejects(authorizeMemoryRequest(request({'x-nrun-sapi-token':'wrong'}),url,{},[],options()),{status:401});
  await assert.rejects(authorizeMemoryRequest(request({authorization:'Basic invalid'}),url,{},[],options()),{status:401});
});

test('tenant bearer credentials use the canonical verifier and its tenant binding', async () => {
  let called;
  const opt = options({validateToken:async input => {called=input;return {ok:true,status:200,data:principal};}});
  const access = await authorizeMemoryRequest(request({authorization:'Bearer legitimate-tenant-token'},'POST'),url,{},['context','retrieve'],opt);
  assert.equal(called.requiredScope,'cognition:read');
  assert.equal(access.tenantUid,tenant);
  assert.equal(access.principalId,'credential:9');
  assert.equal(access.trustedService,false);
  await assert.rejects(authorizeMemoryRequest(request({authorization:'Bearer legitimate-tenant-token','x-nrun-tenant-uid':other}),url,{},[],opt),{status:403});
});

test('API key compatibility, scope denial, revoked tokens and verifier outages fail closed', async () => {
  const access = await authorizeMemoryRequest(request({'x-api-key':'tenant-key'}),url,{},[],options({validateToken:async()=>({ok:true,data:principal})}));
  assert.equal(access.principalId,'credential:9');
  for (const [result,status] of [[{ok:true,data:{isValid:false,status:'scope_denied'}},403],[{ok:true,data:{isValid:false,status:'revoked'}},401],[{ok:false,status:503},503]])
    await assert.rejects(authorizeMemoryRequest(request({'x-api-key':'tenant-key'}),url,{},[],options({validateToken:async()=>result})),{status});
  await assert.rejects(authorizeMemoryRequest(request({'x-api-key':'tenant-key'}),url,{},[],options({validateToken:async()=>({ok:true,data:{...principal,applicationCode:'nodevertex'}})})),{status:403});
  await assert.rejects(authorizeMemoryRequest(request({'x-api-key':'tenant-key'}),url,{},[],options({validateToken:async()=>{throw new Error('network unavailable');}})),{status:503});
});

test('cookie mutations require the application origin; scoped reads require read scope', async () => {
  await assert.rejects(authorizeMemoryRequest(request({},'POST'),url,{},[],options()),{status:403,code:'origin_denied'});
  const access = await authorizeMemoryRequest(request({origin:'https://1db.io'},'POST'),url,{},[],options());
  assert.equal(access.principalId,'account:7');
  assert.equal(requiredMemoryScope('POST',['context','retrieve']),'cognition:read');
  assert.equal(requiredMemoryScope('POST',['events']),'cognition:write');
});

test('untrusted JSON cannot replace principal, actor or trusted service designation', () => {
  const access = {tenantUid:tenant,principalId:'account:7',trustedService:false};
  const bound = bindMemoryRequest({actorId:'owner',accessContext:{tenantUid:other,principalId:'service:root',trustedService:true},scopeRefs:[{scopeType:'room',scopeId:'one'}]},access);
  assert.deepEqual(bound.accessContext,access);
  assert.equal(bound.actorId,'account:7');
  assert.equal(bound.scopeRefs.length,1);
});

test('scoped packet readback is owner-bound; service and old project-only packets remain compatible', () => {
  const access = {tenantUid:tenant,principalId:'account:7',trustedService:false};
  const packet = {scopeContexts:[{scopeType:'persona-instance'}],accessContext:access};
  assert.equal(canReadMemoryPacket(packet,access),true);
  assert.equal(canReadMemoryPacket(packet,{...access,principalId:'account:8'}),false);
  assert.equal(canReadMemoryPacket(packet,{...access,tenantUid:other}),false);
  assert.equal(canReadMemoryPacket({...packet,accessContext:null},access),false);
  assert.equal(canReadMemoryPacket(packet,{...access,trustedService:true}),true);
  assert.equal(canReadMemoryPacket({scopeContexts:[{scopeType:'project'}]},access),true);
  assert.equal(canReadMemoryPacket({continuityState:{legacy:true}},access),true);
});
