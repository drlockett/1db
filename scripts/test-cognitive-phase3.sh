#!/usr/bin/env bash
set -euo pipefail
BASE="${BASE:-http://127.0.0.1:8787}"
ADMIN="${ONE_DB_API_TOKEN:?ONE_DB_API_TOKEN required}"
TENANT="phase3-$RANDOM"
curl -fsS -X POST "$BASE/api/v1/tenants" -H "authorization: Bearer $ADMIN" -H 'content-type: application/json' -d "{\"slug\":\"$TENANT\",\"name\":\"Phase 3\"}" >/tmp/p3_tenant.json
TID=$(python3 - <<'PY'
import json;print(json.load(open('/tmp/p3_tenant.json'))['data']['id'])
PY
)
curl -fsS -X POST "$BASE/api/v1/tenants/$TID/keys" -H "authorization: Bearer $ADMIN" -H 'content-type: application/json' -d '{"scopes":["cognition:write","cognition:read","admin"]}' >/tmp/p3_key.json
KEY=$(python3 - <<'PY'
import json;print(json.load(open('/tmp/p3_key.json'))['data']['key'])
PY
)
curl -fsS -X POST "$BASE/api/v1/cognition/events" -H "authorization: Bearer $KEY" -H 'content-type: application/json' -d '{"type":"agent.decision","actorId":"agent_builder","subjectId":"user_phase3","sessionId":"sess_3","projectId":"project_phase3","workflowId":"wf_phase3","payload":{"text":"agent_builder will implement the workflow replay task and decided Phase 3 must track commitments."},"visibility":{"scope":"project","sensitivity":"normal","retention":"project_lifetime","userMutable":true}}' >/tmp/p3_event.json
curl -fsS "$BASE/api/v1/cognition/agents/agent_builder/continuity" -H "authorization: Bearer $KEY" >/tmp/p3_agent.json
curl -fsS "$BASE/api/v1/cognition/workflows/wf_phase3/replay" -H "authorization: Bearer $KEY" >/tmp/p3_replay.json
curl -fsS -X POST "$BASE/api/v1/cognition/projects/project_phase3/snapshots" -H "authorization: Bearer $KEY" -H 'content-type: application/json' -d '{}' >/tmp/p3_snap.json
python3 - <<'PY'
import json
agent=json.load(open('/tmp/p3_agent.json'))['data']['state']
replay=json.load(open('/tmp/p3_replay.json'))['data']['events']
snap=json.load(open('/tmp/p3_snap.json'))['data']
assert 'project_phase3' in agent['assignedProjects']
assert agent['commitments']
assert replay and replay[0]['workflow_id']=='wf_phase3'
assert snap['id'].startswith('snap_')
print('phase3 ok')
PY
