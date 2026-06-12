# 1db daTALAke Backend Plan

1db should not be reduced to SQL Server. SQL Server is the control ledger inside TALA; the daTALAke should be able to route cognition data across purpose-fit stores.

## Backend Roles

| Backend role | Purpose | Initial state |
| --- | --- | --- |
| `control-sql` | Tenant-scoped metadata, governance, continuity summaries, jobs, audit, provider registry | SQL Server `Nrun`, schema `onedb` |
| `document` | Memory documents, conversational artifacts, embeddings source records, flexible cognition documents | Internal MongoDB service `onedb-mongo` operational |
| `event-object` | Append-only raw events, transcripts, payload snapshots, large source artifacts | Future object/N2/R2-compatible store |
| `vector` | Embeddings and nearest-neighbor recall | Internal Qdrant service `onedb-qdrant` operational |
| `graph` | Entity, relationship, causality, identity, temporal links | SQL edge table first, graph provider later |
| `search` | Lexical/BM25/hybrid recall | SQL lexical first, dedicated index later |
| `hot-cache` | Active context, queue locks, short-lived retrieval/cache packets | Internal VELO/Redis service `velo-redis` operational |
| `notebook` | Research, diagnostics, data science, and consolidation notebooks over lake state | Internal Jupyter service `onedb-jupyter` operational |

## TALA Provider Boundary

TALA should expose a cognitive store contract with methods like:

```text
AppendEvent
StoreMemoryAtom
LinkEvidence
UpsertEntity
LinkEdge
RetrieveContext
GetContinuity
CreateContextPacket
RunConsolidation
```

Provider selection should be metadata-driven through `onedb.StoreBackends`, not hard-coded in the app. A tenant can start fully on SQL Server and later graduate vector or graph workloads without changing the public 1db API.

The live NodeRunner path exposes the effective catalog through:

```text
GET /api/v1/cognition/backends
```

The live route planner exposes how operations map onto those providers:

```text
GET /api/v1/cognition/backends/plan?operation=retrieve
```

The catalog contains `control-sql`, `document`, `event-object`, `vector`, `graph`, `search`, `hot-cache`, and `notebook` roles. MongoDB, Qdrant, Redis, and Jupyter are internal Kubernetes services. As of 2026-06-12, TALA probes them through provider clients and marks `onedb-mongo`, `onedb-qdrant`, `velo-redis`, and `onedb-jupyter` operational when reachable.

The live TALA provider path writes:

- SQL Server `Nrun` / `onedb`: canonical event, memory, continuity, context-packet, and backend registry rows.
- MongoDB `onedb.cognitiveEvents`: event payload documents.
- MongoDB `onedb.contextPackets`: context packet document envelopes.
- Qdrant `onedb_memories`: memory vectors with tenant, project, kind, text, and bootstrap vector metadata.
- Jupyter `onedb-jupyter`: internal research workbench, probed through the notebook API.

The current vector source is a deterministic bootstrap vector so the provider path is real before the embedding worker exists. Replace it with model embeddings during the worker phase without changing the public 1db API.

## Retrieval Shape

Retrieval should combine:

- Actor/tenant/project/workflow authorization filters
- Continuity state
- Lexical relevance
- Vector similarity
- Graph neighborhood
- Temporal relevance, decay, reinforcement, and contradiction flags
- Token-budget-aware context packet assembly

The product promise is not that model context windows become infinite. The promise is that compaction becomes non-destructive because state can be reconstructed from durable cognition.

Each `POST /api/v1/cognition/context/retrieve` call now writes an `onedb.ContextPackets` row containing the summary, continuity state, selected memories, backend plan, and token estimate. Callers can retrieve the packet again with:

```text
GET /api/v1/cognition/context/packets/{packetUid}
```
