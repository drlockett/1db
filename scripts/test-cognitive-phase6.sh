#!/usr/bin/env bash
set -euo pipefail
BASE="${BASE:-http://127.0.0.1:8787}"
ADMIN="${ONE_DB_API_TOKEN:?ONE_DB_API_TOKEN required}"
TENANT="phase6-$RANDOM"
curl -fsS -X POST "$BASE/api/v1/tenants" -H "authorization: Bearer $ADMIN" -H 'content-type: application/json' -d "{\"slug\":\"$TENANT\",\"name\":\"Phase 6\"}" >/tmp/p6_tenant.json
TID=$(python3 - <<'PY'
import json;print(json.load(open('/tmp/p6_tenant.json'))['data']['id'])
PY
)
curl -fsS -X POST "$BASE/api/v1/tenants/$TID/keys" -H "authorization: Bearer $ADMIN" -H 'content-type: application/json' -d '{"scopes":["cognition:write","cognition:read","admin"]}' >/tmp/p6_key.json
KEY=$(python3 - <<'PY'
import json;print(json.load(open('/tmp/p6_key.json'))['data']['key'])
PY
)
BODY='{"idempotencyKey":"idem-phase6","type":"conversation.message","actorId":"user_phase6","subjectId":"user_phase6","projectId":"project_phase6","payload":{"text":"For Phase 6, production hardening must include idempotency, metrics, jobs, dead letters, backup and restore planning."},"visibility":{"scope":"project","sensitivity":"normal","retention":"project_lifetime","userMutable":true}}'
curl -fsS -X POST "$BASE/api/v1/cognition/events" -H "authorization: Bearer $KEY" -H 'content-type: application/json' -d "$BODY" >/tmp/p6_event1.json
curl -fsS -X POST "$BASE/api/v1/cognition/events" -H "authorization: Bearer $KEY" -H 'content-type: application/json' -d "$BODY" >/tmp/p6_event2.json
curl -fsS -X POST "$BASE/api/v1/cognition/jobs/queue" -H "authorization: Bearer $KEY" -H 'content-type: application/json' -d '{"type":"quality_metrics","payload":{"scopeType":"project","scopeId":"project_phase6"}}' >/tmp/p6_job.json
curl -fsS -X POST "$BASE/api/v1/cognition/jobs/process" -H "authorization: Bearer $KEY" -H 'content-type: application/json' -d '{"limit":5}' >/tmp/p6_process.json
curl -fsS "$BASE/api/v1/cognition/ops/metrics" -H "authorization: Bearer $KEY" >/tmp/p6_metrics.json
curl -fsS "$BASE/api/v1/cognition/ops/security-review" -H "authorization: Bearer $KEY" >/tmp/p6_sec.json
curl -fsS "$BASE/api/v1/cognition/ops/backup-plan" -H "authorization: Bearer $KEY" >/tmp/p6_backup.json
python3 - <<'PY'
import json
one=json.load(open('/tmp/p6_event1.json'))['data']['event']['id']
two=json.load(open('/tmp/p6_event2.json'))['data']['event']['id']
assert one==two
assert json.load(open('/tmp/p6_process.json'))['data']['processed'] >= 1
assert 'memoryQuality' in json.load(open('/tmp/p6_metrics.json'))['data']
assert json.load(open('/tmp/p6_sec.json'))['data']['status']=='documented'
assert 'restore' in json.load(open('/tmp/p6_backup.json'))['data']
print('phase6 ok')
PY
