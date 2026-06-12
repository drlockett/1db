# 1db NodeRunner Platform Migration

1db is moving from a Cloudflare Worker/D1 preview into the NodeRunner platform:

```text
1db app -> SAPI -> TALA -> daTALAke
```

The Worker/D1 code remains useful as a preview harness, but canonical cognition data belongs in TALA. Tenant identity must come from `security.Tenants`, application identity from `client.Applications`, and tenant access from `client.TenantApplications`.

## Current Runtime Split

- `src/index.ts`: legacy Cloudflare Worker preview with D1/KV bindings.
- `server/src/server.js`: Kubernetes-ready Node service that exposes public health/readiness, platform manifest, and SAPI-backed cognition proxy routes.
- `Dockerfile`: builds the Kubernetes runtime image as `nrun/1db:<immutable-tag>`.

## Deployed State: 2026-06-12

- Namespace: `nrun-platform`
- Public hosts: `https://1db.io`, `https://www.1db.io`
- 1db image: `nrun/1db:k8s-20260612-phase2-manifest`
- SAPI image: `nrun/sapi.nrun.ws:k8s-onedb-phase2-20260612-004948`
- TALA image: `nrun/tala.nrun.ws:k8s-onedb-phase2-20260612-004948`
- Kubernetes ingress: `one-db`, Traefik class, TLS secret `one-db-tls`
- Origin certificate: Let's Encrypt for `1db.io` and `www.1db.io`, expires `2026-09-10`
- Origin certificate renewal: `/opt/nrun-certs/1db.io/renew-and-sync.sh` on `seca`, scheduled daily at `03:17`
- Cloudflare DNS: apex proxied A record to `108.181.221.199`; `www` proxied CNAME to apex
- Cloudflare routing: legacy Worker route `1db.io/* -> 1db-io` removed for public cutover
- Cloudflare SSL mode: `strict`; Always Use HTTPS: `on`

Public smoke checks passed for `/`, `/health`, `/ready`, `/api/v1/platform/manifest`, `POST /api/v1/cognition/events`, `POST /api/v1/cognition/context/retrieve`, `GET /api/v1/cognition/context/packets/{packetUid}`, and `GET /api/v1/cognition/backends`.

## Canonical API Path

External callers use:

```text
POST /api/v1/cognition/events
POST /api/v1/cognition/context/retrieve
GET  /api/v1/cognition/context/packets/{packetUid}
GET  /api/v1/cognition/backends
GET  /api/v1/cognition/projects/{projectId}/continuity
```

The Kubernetes app requires one of:

- `X-NRun-Tenant-Uid`
- `X-1db-Tenant-Uid`
- `tenantUid` query value
- `tenantUid` JSON body value

The app forwards requests to:

```text
/v1/platform/applications/1db/tenants/{tenantUid}/cognition/*
```

## Platform Phases

1. Runtime: deploy `1db-api` in `nrun-platform` with SAPI token, health probes, and ingress.
2. Registration: register `1db` in `client.Applications` and map authorized tenants through `client.TenantApplications`.
3. TALA schema: create `onedb` SQL Server schema for control-ledger persistence and backend registry.
4. SAPI/TALA controllers: implement ingestion, retrieval, continuity, governance, and context packet routes.
5. daTALAke expansion: add vector, graph, object/event, search, and cache providers behind TALA-owned abstractions.
6. Workers: add Kubernetes workers for embedding, consolidation, decay, contradiction review, and context packet precomputation.

## Data Ownership

TALA owns:

- Cognitive event log
- Memory atoms
- Evidence links
- Cognitive entities and edges
- Continuity states
- Context packets
- Governance/audit/export records
- Backend routing metadata

The 1db app owns:

- Public/docs/admin UX
- Request shaping
- SAPI token use
- Compatibility routing while APIs settle

The app must not create its own tenant authority.
