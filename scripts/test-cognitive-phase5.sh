#!/usr/bin/env bash
set -euo pipefail
BASE="${BASE:-http://127.0.0.1:8787}"
ADMIN="${ONE_DB_API_TOKEN:?ONE_DB_API_TOKEN required}"
TENANT="phase5-$RANDOM"
curl -fsS -X POST "$BASE/api/v1/tenants" -H "authorization: Bearer $ADMIN" -H 'content-type: application/json' -d "{\"slug\":\"$TENANT\",\"name\":\"Phase 5\"}" >/tmp/p5_tenant.json
TID=$(python3 - <<'PY'
import json;print(json.load(open('/tmp/p5_tenant.json'))['data']['id'])
PY
)
curl -fsS -X POST "$BASE/api/v1/tenants/$TID/keys" -H "authorization: Bearer $ADMIN" -H 'content-type: application/json' -d '{"scopes":["cognition:write","cognition:read","admin"]}' >/tmp/p5_key.json
KEY=$(python3 - <<'PY'
import json;print(json.load(open('/tmp/p5_key.json'))['data']['key'])
PY
)
for i in 1 2 3; do curl -fsS -X POST "$BASE/api/v1/cognition/events" -H "authorization: Bearer $KEY" -H 'content-type: application/json' -d '{"type":"conversation.message","actorId":"user_phase5","subjectId":"user_phase5","projectId":"project_phase5","payload":{"text":"For Phase 5, we decided consolidation should merge duplicate memories, decay stale memories, and summarize durable decisions."},"visibility":{"scope":"project","sensitivity":"normal","retention":"project_lifetime","userMutable":true}}' >/dev/null; done
curl -fsS -X POST "$BASE/api/v1/cognition/consolidation/run" -H "authorization: Bearer $KEY" -H 'content-type: application/json' -d '{"scopeType":"project","scopeId":"project_phase5"}' >/tmp/p5_consolidate.json
curl -fsS "$BASE/api/v1/cognition/quality/metrics?scopeType=project&scopeId=project_phase5" -H "authorization: Bearer $KEY" >/tmp/p5_metrics.json
curl -fsS -X POST "$BASE/api/v1/cognition/context/packet" -H "authorization: Bearer $KEY" -H 'content-type: application/json' -d '{"actorId":"user_phase5","projectId":"project_phase5","query":"consolidation decisions","intent":"summarize_state"}' >/tmp/p5_packet.json
curl -fsS -X POST "$BASE/api/v1/cognition/memories/resurface" -H "authorization: Bearer $KEY" -H 'content-type: application/json' -d '{"projectId":"project_phase5","query":"decay duplicate consolidation","limit":5}' >/tmp/p5_resurface.json
python3 - <<'PY'
import json
assert json.load(open('/tmp/p5_consolidate.json'))['data']['status']=='completed'
assert json.load(open('/tmp/p5_metrics.json'))['data']['total'] >= 1
assert json.load(open('/tmp/p5_packet.json'))['data']['tokenEstimate'] > 0
assert json.load(open('/tmp/p5_resurface.json'))['data']['items']
print('phase5 ok')
PY
