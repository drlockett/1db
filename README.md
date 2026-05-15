# 1db.io

1db.io is a programmable edge API platform for links, routes, intakes, webhooks, and lightweight internet-addressable resources.

## Local development

```bash
npm install
npm run check
npx wrangler d1 migrations apply 1db-control --local
npx wrangler dev --local
```

## Production deploy

```bash
export CLOUDFLARE_API_TOKEN=...
npx wrangler d1 migrations apply 1db-control --remote
npx wrangler deploy
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

The MVP uses Cloudflare D1 tables for append-only events, memory atoms, evidence, entities, graph edges, continuity states, and lexical embedding metadata. Vector-provider integration, contradiction handling, consolidation, decay jobs, and governance UI are next-phase work.

### Cognitive integrity Phase 2

Phase 2 adds duplicate candidate links, reinforcement events, contradiction reports, reinforcement-aware ranking, stale/low-confidence warning hooks, and graph relationship context.

```bash
npm run test:cognition:phase2
```
