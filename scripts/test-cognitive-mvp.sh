#!/usr/bin/env bash
set -euo pipefail
BASE=${BASE:-https://1db.io}
ADMIN_TOKEN=${ONE_DB_API_TOKEN:-$(sed -n 's/^ONE_DB_API_TOKEN=//p' .env.local 2>/dev/null || true)}
if [ -z "$ADMIN_TOKEN" ]; then echo "ONE_DB_API_TOKEN required" >&2; exit 2; fi
RUN=$(date +%s)
TENANT="cogtest$RUN"; OTHER="cogother$RUN"; PROJECT="project_1db_$RUN"
curl -fsS -X POST "$BASE/api/v1/tenants" -H "Authorization: Bearer $ADMIN_TOKEN" -H 'Content-Type: application/json' -d "{\"slug\":\"$TENANT\",\"name\":\"Cognition Test $RUN\"}" >/dev/null
curl -fsS -X POST "$BASE/api/v1/tenants" -H "Authorization: Bearer $ADMIN_TOKEN" -H 'Content-Type: application/json' -d "{\"slug\":\"$OTHER\",\"name\":\"Other Cog Test $RUN\"}" >/dev/null
curl -fsS -X POST "$BASE/api/v1/tenants/$TENANT/keys" -H "Authorization: Bearer $ADMIN_TOKEN" -H 'Content-Type: application/json' -d '{"name":"cog-mvp"}' >/tmp/cog-key.json
curl -fsS -X POST "$BASE/api/v1/tenants/$OTHER/keys" -H "Authorization: Bearer $ADMIN_TOKEN" -H 'Content-Type: application/json' -d '{"name":"cog-other"}' >/tmp/cog-other-key.json
KEY=$(node -e "console.log(JSON.parse(require('fs').readFileSync('/tmp/cog-key.json','utf8')).data.key)")
OTHERKEY=$(node -e "console.log(JSON.parse(require('fs').readFileSync('/tmp/cog-other-key.json','utf8')).data.key)")
TEXT='For 1db, we decided cognitive persistence must include an event log, memory atoms, a cognition graph, continuity state, and correction lifecycle. The MVP should focus on project continuity. This applies to the 1db project.'
curl -fsS -X POST "$BASE/api/v1/cognition/events" -H "Authorization: Bearer $KEY" -H 'Content-Type: application/json' -d "{\"type\":\"conversation.message\",\"actorId\":\"user_123\",\"projectId\":\"$PROJECT\",\"payload\":{\"text\":$(node -e 'console.log(JSON.stringify(process.argv[1]))' "$TEXT")},\"visibility\":{\"scope\":\"project\",\"sensitivity\":\"normal\",\"retention\":\"project_lifetime\",\"userMutable\":true}}" >/tmp/cog-ingest.json
MEM=$(node -e "const o=JSON.parse(require('fs').readFileSync('/tmp/cog-ingest.json','utf8')); if(!o.data.event.id||o.data.extractedMemoryIds.length<2) throw Error('bad ingest'); console.log(o.data.extractedMemoryIds[0])")
curl -fsS "$BASE/api/v1/cognition/projects/$PROJECT/continuity" -H "Authorization: Bearer $KEY" >/tmp/cog-continuity.json
grep -q 'event log' /tmp/cog-continuity.json; grep -q 'project continuity' /tmp/cog-continuity.json
curl -fsS -X POST "$BASE/api/v1/cognition/context/retrieve" -H "Authorization: Bearer $KEY" -H 'Content-Type: application/json' -d "{\"actorId\":\"agent_architect\",\"projectId\":\"$PROJECT\",\"query\":\"Design implementation for 1db cognitive persistence\",\"intent\":\"plan_next_step\",\"limits\":{\"maxMemories\":20}}" >/tmp/cog-retrieve.json
grep -q 'memories' /tmp/cog-retrieve.json; grep -q 'provenance' /tmp/cog-retrieve.json; grep -q 'event log' /tmp/cog-retrieve.json
curl -fsS "$BASE/api/v1/cognition/memories/$MEM/explain" -H "Authorization: Bearer $KEY" >/tmp/cog-explain.json
grep -q 'Remembered as' /tmp/cog-explain.json; grep -q 'evidence' /tmp/cog-explain.json
curl -fsS -X PATCH "$BASE/api/v1/cognition/memories/$MEM/correct" -H "Authorization: Bearer $KEY" -H 'Content-Type: application/json' -d '{"actorId":"user_123","correction":"1db cognitive persistence MVP includes append-only events, evidenced memory atoms, project continuity state, ACL-filtered retrieval, and correction lifecycle.","reason":"User correction"}' >/tmp/cog-correct.json
NEWMEM=$(node -e "console.log(JSON.parse(require('fs').readFileSync('/tmp/cog-correct.json','utf8')).data.id)")
curl -fsS -X PATCH "$BASE/api/v1/cognition/memories/$NEWMEM/deprecate" -H "Authorization: Bearer $KEY" -H 'Content-Type: application/json' -d '{"actorId":"user_123","reason":"Testing deprecation"}' >/tmp/cog-deprecate.json
grep -q 'deprecated' /tmp/cog-deprecate.json
curl -fsS -X POST "$BASE/api/v1/cognition/context/retrieve" -H "Authorization: Bearer $KEY" -H 'Content-Type: application/json' -d "{\"actorId\":\"agent_architect\",\"projectId\":\"$PROJECT\",\"query\":\"ACL-filtered retrieval\",\"intent\":\"answer_question\"}" >/tmp/cog-after-dep.json
if grep -q 'ACL-filtered retrieval' /tmp/cog-after-dep.json; then echo 'deprecated memory leaked into normal retrieval' >&2; exit 1; fi
curl -fsS -X POST "$BASE/api/v1/cognition/events" -H "Authorization: Bearer $KEY" -H 'Content-Type: application/json' -d "{\"type\":\"conversation.message\",\"actorId\":\"actor_allowed\",\"projectId\":\"$PROJECT\",\"payload\":{\"text\":\"We decided the private launch codename is Blue Heron.\"},\"visibility\":{\"scope\":\"private_user\",\"allowedActorIds\":[\"actor_allowed\"],\"sensitivity\":\"confidential\",\"retention\":\"project_lifetime\",\"userMutable\":true}}" >/tmp/cog-private.json
curl -fsS -X POST "$BASE/api/v1/cognition/context/retrieve" -H "Authorization: Bearer $KEY" -H 'Content-Type: application/json' -d "{\"actorId\":\"actor_other\",\"projectId\":\"$PROJECT\",\"query\":\"Blue Heron\",\"intent\":\"answer_question\"}" >/tmp/cog-private-filtered.json
if grep -q 'Blue Heron' /tmp/cog-private-filtered.json; then echo 'private memory leaked to unauthorized actor' >&2; exit 1; fi
grep -q 'permission_filtered' /tmp/cog-private-filtered.json
curl -fsS -X POST "$BASE/api/v1/cognition/context/retrieve" -H "Authorization: Bearer $OTHERKEY" -H 'Content-Type: application/json' -d "{\"actorId\":\"agent_other\",\"projectId\":\"$PROJECT\",\"query\":\"event log memory atoms\",\"intent\":\"answer_question\"}" >/tmp/cog-other-tenant.json
if grep -q 'event log' /tmp/cog-other-tenant.json; then echo 'cross-tenant memory leak' >&2; exit 1; fi
curl -fsS -X POST "$BASE/v1/context/retrieve" -H "Authorization: Bearer $KEY" -H 'Content-Type: application/json' -d "{\"actorId\":\"agent_architect\",\"projectId\":\"$PROJECT\",\"query\":\"project continuity\",\"intent\":\"summarize_state\"}" | grep -q 'summary'
printf 'COGNITIVE MVP E2E PASS project=%s mem=%s corrected=%s\n' "$PROJECT" "$MEM" "$NEWMEM"
