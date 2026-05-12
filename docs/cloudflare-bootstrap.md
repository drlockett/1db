# Cloudflare bootstrap

## Account and zone

- Account: Dr.lockett@hotmail.com's Account
- Account ID: 28a4f8fccb889aa77bc39075654c49cd
- Zone: 1db.io
- Zone ID observed from Wrangler route attempt: eb0a8f03bf4dcda9504890744b3ed90f
- Worker: 1db-io
- Reachable Worker endpoint: https://1db-io.dr-lockett.workers.dev

## Worker routes

Intended production route:

- `1db.io/* -> 1db-io`

Current blocker:

- Worker code, D1, KV, secret, migration, and deployment succeeded.
- Route attachment failed with Cloudflare API authentication error code `10000` for zone `1db.io`.
- The provided token can deploy Worker resources, create D1/KV, and read account info, but does not have the zone route permission needed for `/zones/.../workers/routes`.

Required token permission to finish root-domain route:

- Zone: `1db.io`
- Workers Routes: Edit, or equivalent zone-level route permission
- Zone: Read

## Storage/control plane

- D1 database: `1db-control`
- KV namespace binding: `ALIAS_CACHE`
- Worker secret: `ONE_DB_API_TOKEN` configured through Wrangler secret
- Local copy of the 1db API token: `.env.local` with file mode 600, not committed

## Verification completed

- `npm run check` passed.
- Local D1 migrations applied.
- Remote D1 migrations applied.
- Live Worker endpoint health/home/admin/docs passed.
- Live Worker API created `/a/x3`.
- Live Worker `/a/x3?hello=world` redirects to `https://nodevertex.com/nrun/apps/firestorm?hello=world`.
- Live Worker JSON negotiation for `/a/x3` returns metadata.
- Analytics endpoint contains redirect events.

## Rollback

- Worker can be rolled back from Cloudflare Workers deployment history.
- Route is not attached to `1db.io` yet due permissions, so no production domain traffic is currently impacted by this deployment.

## Current domain probe

As of deployment verification, `https://1db.io/`, `/health`, and `/a/x3` return the pre-existing lander redirect HTML rather than the 1db Worker. This confirms the custom domain route is not attached yet.
