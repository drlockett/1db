# 1db.io

1db.io is cognitive infrastructure for persistent memory, project-aware execution context, and agent continuity.

## Local development

```bash
npm install
npm run start:platform
```

## Production deploy

```bash
docker build -t one-db-platform-server .
```

## API keys

Tenant API keys are stored hashed only. Bootstrap tenant/key creation uses `ONE_DB_API_TOKEN`:

```bash
curl -X POST https://1db.io/api/v1/tenants/nodevertex/keys \
  -H "Authorization: Bearer $ONE_DB_API_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"name":"nodevertex-prod"}'
```

## Create a short link

```bash
curl -X POST https://1db.io/api/v1/links \
  -H "Authorization: Bearer $ONE_DB_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"code":"demo","destinationUrl":"https://example.com"}'
```

## Public intake

```bash
curl -X POST https://1db.io/api/v1/intakes \
  -H "Authorization: Bearer $ONE_DB_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"slug":"waitlist","name":"Waitlist"}'

curl -X POST https://1db.io/i/{tenant}/waitlist \
  -H "Content-Type: application/json" \
  -d '{"email":"jane@example.com"}'
```

## CLI

```bash
export ONE_DB_API_KEY=1db_live_...
./cli/1db links create --code demo --url https://example.com
```

A validated local Homebrew tap is available at `/Users/nr-admin/homebrew-1db`. It maps to `brew tap drlockett/1db` and supports `brew install drlockett/1db/1db` through `Aliases/1db` -> `Formula/one-db.rb`.

## Cognitive persistence MVP

Phase 1 project continuity endpoints:

```bash
POST  /api/v1/cognition/events
POST  /api/v1/cognition/context/retrieve
GET   /api/v1/cognition/projects/{projectId}/continuity
GET   /api/v1/cognition/memories/{memoryId}/explain
PATCH /api/v1/cognition/memories/{memoryId}/correct
PATCH /api/v1/cognition/memories/{memoryId}/deprecate
```

Run the live integration scenario:

```bash
npm run test:cognition
```

The live app runs as the 1db platform server and uses the platform API for durable cognition persistence. Canonical 1db cognition data belongs in managed 1db storage under the `onedb` schema, with provider-backed document, vector, graph, cache, and notebook roles represented by backend catalog records.

## Project Cognition

Project Cognition is first-class persistent execution memory for how an AI should operate within a project, team, workspace, tenant, repository, environment, or domain.

Public app routes proxy through the platform API into managed 1db persistence:

```bash
GET    /api/project-cognition
GET    /api/project-cognition/{projectKey}
POST   /api/project-cognition
PUT    /api/project-cognition/{id}
POST   /api/project-cognition/{id}/activate
POST   /api/project-cognition/{id}/deactivate
GET    /api/project-cognition/{projectKey}/active
```

The active response includes `agentContext`, suitable for agent initialization, workspace bootstrapping, and prompt assembly.

### Cognitive integrity Phase 2

Phase 2 adds duplicate candidate links, reinforcement events, contradiction reports, reinforcement-aware ranking, stale/low-confidence warning hooks, and graph relationship context.

```bash
npm run test:cognition:phase2
```
