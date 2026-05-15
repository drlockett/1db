#!/usr/bin/env bash
set -euo pipefail
BASE="${BASE:-http://127.0.0.1:8787}"
ADMIN="${ONE_DB_API_TOKEN:?ONE_DB_API_TOKEN required}"
TENANT="phase4-$RANDOM"
curl -fsS -X POST "$BASE/api/v1/tenants" -H "authorization: Bearer $ADMIN" -H 'content-type: application/json' -d "{\"slug\":\"$TENANT\",\"name\":\"Phase 4\"}" >/tmp/p4_tenant.json
TID=$(python3 - <<'PY'
import json;print(json.load(open('/tmp/p4_tenant.json'))['data']['id'])
PY
)
curl -fsS -X POST "$BASE/api/v1/tenants/$TID/keys" -H "authorization: Bearer $ADMIN" -H 'content-type: application/json' -d '{"scopes":["cognition:write","cognition:read","admin"]}' >/tmp/p4_key.json
KEY=$(python3 - <<'PY'
import json;print(json.load(open('/tmp/p4_key.json'))['data']['key'])
PY
)
curl -fsS -X POST "$BASE/api/v1/cognition/events" -H "authorization: Bearer $KEY" -H 'content-type: application/json' -d '{"type":"conversation.message","actorId":"user_phase4","subjectId":"user_phase4","projectId":"project_phase4","payload":{"text":"For Phase 4, we decided memory governance must support export, audit replay, retention, and logical deletion."},"visibility":{"scope":"project","sensitivity":"normal","retention":"project_lifetime","userMutable":true}}' >/tmp/p4_event.json
MEM=$(python3 - <<'PY'
import json;print(json.load(open('/tmp/p4_event.json'))['data']['extractedMemoryIds'][0])
PY
)
curl -fsS "$BASE/api/v1/cognition/governance/memories?actorId=user_phase4&projectId=project_phase4" -H "authorization: Bearer $KEY" >/tmp/p4_list.json
curl -fsS -X PATCH "$BASE/api/v1/cognition/governance/memories/$MEM/retention" -H "authorization: Bearer $KEY" -H 'content-type: application/json' -d '{"actorId":"user_phase4","retention":"fixed_duration","staleAfter":"2099-01-01T00:00:00Z"}' >/tmp/p4_retention.json
curl -fsS "$BASE/api/v1/cognition/audit/memories/$MEM/replay" -H "authorization: Bearer $KEY" >/tmp/p4_audit.json
curl -fsS -X POST "$BASE/api/v1/cognition/governance/export" -H "authorization: Bearer $KEY" -H 'content-type: application/json' -d '{"actorId":"user_phase4","projectId":"project_phase4"}' >/tmp/p4_export.json
curl -fsS -X DELETE "$BASE/api/v1/cognition/governance/memories/$MEM" -H "authorization: Bearer $KEY" -H 'content-type: application/json' -d '{"actorId":"user_phase4","reason":"test deletion"}' >/tmp/p4_delete.json
python3 - <<'PY'
import json
assert json.load(open('/tmp/p4_list.json'))['data']['items']
assert json.load(open('/tmp/p4_retention.json'))['data']['access']['retention']=='fixed_duration'
assert json.load(open('/tmp/p4_audit.json'))['data']['events']
assert json.load(open('/tmp/p4_export.json'))['data']['memories']
assert json.load(open('/tmp/p4_delete.json'))['data']['status']=='deleted'
print('phase4 ok')
PY
