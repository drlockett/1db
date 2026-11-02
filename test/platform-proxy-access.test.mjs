import assert from 'node:assert/strict';
import { createServer } from 'node:http';
import { createHmac } from 'node:crypto';
import { spawn } from 'node:child_process';
import { once } from 'node:events';
import test from 'node:test';

const tenant = '11111111-1111-4111-8111-111111111111';
const other = '22222222-2222-4222-8222-222222222222';
const service = 'local-verification-service-token';
const credential = 'local-verification-tenant-credential';

test('all public cognition aliases enforce principal and tenant binding before proxying', async t => {
  const calls = [];
  const upstream = createServer(async (req, res) => {
    const chunks=[]; for await (const chunk of req) chunks.push(chunk);
    const body = chunks.length ? JSON.parse(Buffer.concat(chunks)) : null;
    calls.push({path:req.url,body,token:req.headers['x-nrun-sapi-token']});
    res.setHeader('content-type','application/json');
    if (req.url.endsWith('/tenant-credentials/validate')) return res.end(JSON.stringify({isValid:body.token===credential,status:'allowed',applicationCode:'1db',tenantUid:tenant,credentialId:9,scopes:['cognition:read','cognition:write']}));
    if (req.url.includes('/context/packets/')) return res.end(JSON.stringify({packet:{scopeContexts:[{scopeType:'persona-instance'}],accessContext:{tenantUid:tenant,principalId:'account:8'}}}));
    if (req.url === '/v1/accounts/login') return res.end(JSON.stringify({id:7,tenantId:42,email:'fixture@example.invalid'}));
    if (req.url === '/v1/platform/tenants/42') return res.end(JSON.stringify({tenantId:42,tenantUid:tenant}));
    return res.end(JSON.stringify({ok:true,body}));
  });
  await new Promise((resolve,reject)=>upstream.once('error',reject).listen(0,'127.0.0.1',resolve));
  t.after(()=>new Promise(resolve=>upstream.close(resolve)));
  const child=spawn(process.execPath,[new URL('../server/src/server.js',import.meta.url).pathname],{
    env:{...process.env,PORT:'0',PUBLIC_ORIGIN:'https://1db.io',SAPI_BASE_URL:`http://127.0.0.1:${upstream.address().port}/v1`,SAPI_SERVICE_TOKEN:service,NRUN_SAPI_SERVICE_TOKEN:service,ONE_DB_SESSION_SECRET:service},
    stdio:['ignore','pipe','pipe']
  });
  t.after(async()=>{if(child.exitCode===null){child.kill();await once(child,'exit');}});
  const port=await new Promise((resolve,reject)=>{
    const timer=setTimeout(()=>reject(new Error('The local fixture did not start.')),10000);
    child.once('error',error=>{clearTimeout(timer);reject(error);});
    child.once('exit',()=>{clearTimeout(timer);reject(new Error('The local fixture exited before readiness.'));});
    child.stdout.on('data',chunk=>{const match=/listening on (\d+)/.exec(chunk.toString());if(match){clearTimeout(timer);resolve(Number(match[1]));}});
  });
  const base=`http://127.0.0.1:${port}`;
  const call=(path,options={})=>fetch(base+path,{...options,headers:{'content-type':'application/json',...(options.headers||{})}});
  const signedCookie=accountId=>{
    const encoded=Buffer.from(JSON.stringify({accountId,tenantUid:tenant,tenantId:42,expires:Date.now()+60000})).toString('base64url');
    return `one_db_session=${encoded}.${createHmac('sha256',service).update(encoded).digest('base64url')}`;
  };

  for(const path of ['/api/v1/cognition/backends','/1db/cognition','/api/v1/cam','/api/project-cognition','/api/v1/project-cognition']){
    const response=await call(path,{headers:{'x-nrun-tenant-uid':tenant}});
    assert.equal(response.status,401,path);
  }
  const anonymous=await call('/api/v1/cognition/context/retrieve',{method:'POST',body:JSON.stringify({tenantUid:tenant,accessContext:{trustedService:true}})});
  assert.equal(anonymous.status,401);
  assert.equal(calls.length,0,'anonymous calls must not exercise the platform service credential');

  const mismatch=await call('/api/v1/cognition/backends',{headers:{cookie:signedCookie(7),'x-nrun-tenant-uid':other}});
  assert.equal(mismatch.status,403);
  assert.equal(calls.length,0);

  const deniedOrigin=await call('/api/v1/cognition/events',{method:'POST',headers:{cookie:signedCookie(7)},body:'{}'});
  assert.equal(deniedOrigin.status,403);
  const forged=await call('/api/v1/cognition/context/retrieve',{method:'POST',headers:{authorization:`Bearer ${credential}`},body:JSON.stringify({ActorId:'owner',AccessContext:{tenantUid:other,trustedService:true},accessContext:{principalId:'service:root',trustedService:true},scopeRefs:[{scopeType:'room',scopeId:'fixture'}]})});
  assert.equal(forged.status,200);
  const observed=calls.at(-1);
  assert.equal(observed.token,service);
  assert.ok(observed.path.includes(`/tenants/${tenant}/`));
  assert.deepEqual(observed.body.accessContext,{tenantUid:tenant,principalId:'credential:9',trustedService:false});
  assert.equal(observed.body.actorId,'credential:9');
  assert.equal(observed.body.AccessContext,undefined);

  const trusted=await call('/api/v1/cognition/context/retrieve',{method:'POST',headers:{'x-nrun-sapi-token':service,'x-nrun-tenant-uid':tenant},body:'{}'});
  assert.equal(trusted.status,200);
  assert.equal(calls.at(-1).body.accessContext.trustedService,true);

  const privatePacket=await call('/api/v1/cognition/context/packets/fixture',{headers:{cookie:signedCookie(7)}});
  assert.equal(privatePacket.status,403,'a tenant peer cannot export another principal’s scoped packet');

  const signIn=await fetch(`${base}/signin`,{method:'POST',redirect:'manual',headers:{'content-type':'application/x-www-form-urlencoded'},body:'email=fixture%40example.invalid&password=local-fixture-password'});
  assert.equal(signIn.status,303);
  const cookie=signIn.headers.get('set-cookie');
  const encoded=decodeURIComponent(cookie.split(';')[0].split('=')[1]).split('.')[0];
  assert.equal(JSON.parse(Buffer.from(encoded,'base64url')).tenantUid,tenant,'session tenant must come from the authenticated account’s canonical tenant');
});
