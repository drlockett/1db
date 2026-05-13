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

Homebrew tap scaffold is included at `homebrew/Formula/1db.rb` for `drlockett/1db/1db`.
