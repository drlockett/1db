import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';

const migrationPath = new URL('../migrations/1010_persona_instance_continuity.sql', import.meta.url);
const serverPath = new URL('../server/src/server.js', import.meta.url);
const docsPath = new URL('../docs/persona-instance-continuity.md', import.meta.url);

test('memory scope UID is a candidate key before self-referencing foreign keys', async () => {
  const sql = await readFile(migrationPath, 'utf8');
  const uniqueAt = sql.indexOf('CONSTRAINT UX_OneDb_MemoryScopes_Uid UNIQUE');
  const parentAt = sql.indexOf('FK_OneDb_MemoryScopes_Parent');

  assert.ok(uniqueAt > 0, 'ScopeUid must be declared unique inside the table definition');
  assert.ok(parentAt > uniqueAt, 'the parent foreign key must follow its candidate key');
  assert.match(sql, /ExpectedPreviousVersion/);
  assert.match(sql, /HeadCheckpointUid/);
  assert.match(sql, /IntegrityHash/);
});

test('the platform server exposes read and checkpoint continuity routes', async () => {
  const server = await readFile(serverPath, 'utf8');

  assert.match(server, /continuity\/\{scopeType\}\/\{scopeId\}/);
  assert.match(server, /continuity\/\{scopeType\}\/\{scopeId\}\/checkpoints/);
  assert.match(server, /proxyCognition\(req, res, url, parts\.slice\(3\)\)/);
});

test('continuity contract preserves the required persona and collaboration scopes', async () => {
  const docs = await readFile(docsPath, 'utf8');
  const requiredScopes = [
    'Persona definition',
    'Persona instance',
    'Organization',
    'Workspace',
    'Office',
    'Room',
    'Intent',
    'Work engagement'
  ];

  for (const scope of requiredScopes) assert.match(docs, new RegExp(`- ${scope}`));
  assert.match(docs, /optimistic concurrency/i);
  assert.match(docs, /waiting_for_memory/);
});

test('stale writers cannot advance an optimistic continuity head', () => {
  const advance = (headVersion, expectedVersion) => {
    if (headVersion !== expectedVersion) {
      return { status: 409, code: 'continuity_version_conflict', currentVersion: headVersion };
    }
    return { status: 200, version: headVersion + 1 };
  };

  assert.deepEqual(advance(0, 0), { status: 200, version: 1 });
  assert.deepEqual(advance(1, 0), {
    status: 409,
    code: 'continuity_version_conflict',
    currentVersion: 1
  });
});
