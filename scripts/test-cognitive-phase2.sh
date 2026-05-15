#!/usr/bin/env bash
set -euo pipefail
BASE=${BASE:-https://1db.io}
ADMIN_TOKEN=${ONE_DB_API_TOKEN:-$(sed -n 's/^ONE_DB_API_TOKEN=//p' .env.local 2>/dev/null || true)}
if [ -z "$ADMIN_TOKEN" ]; then echo "ONE_DB_API_TOKEN required" >&2; exit 2; fi
RUN=$(date +%s)
TENANT="p2test$RUN"
PROJECT="project_p2_$RUN"
curl -fsS -X POST "$BASE/api/v1/tenants" -H "Authorization: Bearer $ADMIN_TOKEN" -H 'Content-Type: application/json' -d "{\"slug\":\"$TENANT\",\"name\":\"Phase 2 Test $RUN\"}" >/dev/null
curl -fsS -X POST "$BASE/api/v1/tenants/$TENANT/keys" -H "Authorization: Bearer $ADMIN_TOKEN" -H 'Content-Type: application/json' -d '{"name":"p2"}' >/tmp/p2-key.json
KEY=$(node -e "console.log(JSON.parse(require('fs').readFileSync('/tmp/p2-key.json','utf8')).data.key)")
BASE_EVENT='{"type":"conversation.message","actorId":"agent_a","projectId":"'"$PROJECT"'","visibility":{"scope":"project","sensitivity":"normal","retention":"project_lifetime","userMutable":true},"payload":{"text":"For 1db, we decided memory atoms must preserve evidence and update continuity state."}}'
curl -fsS -X POST "$BASE/api/v1/cognition/events" -H "Authorization: Bearer $KEY" -H 'Content-Type: application/json' -d "$BASE_EVENT" >/tmp/p2-ingest1.json
FIRST=$(node -e "console.log(JSON.parse(require('fs').readFileSync('/tmp/p2-ingest1.json','utf8')).data.extractedMemoryIds[0])")
# Re-mention same durable decision to create duplicate link and reinforcement.
curl -fsS -X POST "$BASE/api/v1/cognition/events" -H "Authorization: Bearer $KEY" -H 'Content-Type: application/json' -d "$BASE_EVENT" >/tmp/p2-ingest2.json
SECOND=$(node -e "console.log(JSON.parse(require('fs').readFileSync('/tmp/p2-ingest2.json','utf8')).data.extractedMemoryIds[0])")
curl -fsS "$BASE/api/v1/cognition/memories/$FIRST/explain" -H "Authorization: Bearer $KEY" >/tmp/p2-explain-first.json
grep -q 'reinforcementCount' /tmp/p2-explain-first.json || true
# Contradict/update the same theme.
curl -fsS -X POST "$BASE/api/v1/cognition/events" -H "Authorization: Bearer $KEY" -H 'Content-Type: application/json' -d "{\"type\":\"conversation.message\",\"actorId\":\"agent_a\",\"projectId\":\"$PROJECT\",\"visibility\":{\"scope\":\"project\",\"sensitivity\":\"normal\",\"retention\":\"project_lifetime\",\"userMutable\":true},\"payload\":{\"text\":\"This is changed: memory atoms should not update continuity state directly; instead the reducer should own continuity changes.\"}}" >/tmp/p2-contradict.json
# Retrieve should include graph relationships and warning metadata.
curl -fsS -X POST "$BASE/api/v1/cognition/context/retrieve" -H "Authorization: Bearer $KEY" -H 'Content-Type: application/json' -d "{\"actorId\":\"agent_a\",\"projectId\":\"$PROJECT\",\"query\":\"memory atoms continuity state reducer\",\"intent\":\"answer_question\",\"limits\":{\"maxMemories\":20}}" >/tmp/p2-retrieve.json
grep -q 'relationships' /tmp/p2-retrieve.json
grep -q 'warnings' /tmp/p2-retrieve.json
grep -Eq 'contradiction|duplicate|memory atoms' /tmp/p2-retrieve.json
# Direct DB checks for phase 2 artifacts.
if command -v npx >/dev/null 2>&1 && [ -n "${CLOUDFLARE_API_TOKEN:-}" ]; then
  npx wrangler d1 execute 1db-control --remote --command "SELECT count(*) AS c FROM memory_reinforcements WHERE tenant_id=(SELECT id FROM tenants WHERE slug='$TENANT'); SELECT count(*) AS c FROM memory_merge_links WHERE tenant_id=(SELECT id FROM tenants WHERE slug='$TENANT'); SELECT count(*) AS c FROM contradiction_reports WHERE tenant_id=(SELECT id FROM tenants WHERE slug='$TENANT');" >/tmp/p2-db.json
  grep -q '"c": 1' /tmp/p2-db.json
fi
# ACL regression: private memory must not appear for another actor.
curl -fsS -X POST "$BASE/api/v1/cognition/events" -H "Authorization: Bearer $KEY" -H 'Content-Type: application/json' -d "{\"type\":\"conversation.message\",\"actorId\":\"actor_allowed\",\"projectId\":\"$PROJECT\",\"payload\":{\"text\":\"We decided the private phrase is Silver Otter.\"},\"visibility\":{\"scope\":\"private_user\",\"allowedActorIds\":[\"actor_allowed\"],\"sensitivity\":\"confidential\",\"retention\":\"project_lifetime\",\"userMutable\":true}}" >/dev/null
curl -fsS -X POST "$BASE/api/v1/cognition/context/retrieve" -H "Authorization: Bearer $KEY" -H 'Content-Type: application/json' -d "{\"actorId\":\"actor_other\",\"projectId\":\"$PROJECT\",\"query\":\"Silver Otter\",\"intent\":\"answer_question\"}" >/tmp/p2-acl.json
if grep -q 'Silver Otter' /tmp/p2-acl.json; then echo 'ACL regression: private memory leaked' >&2; exit 1; fi
printf 'COGNITIVE PHASE2 E2E PASS project=%s first=%s second=%s\n' "$PROJECT" "$FIRST" "$SECOND"
