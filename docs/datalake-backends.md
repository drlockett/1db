# 1db daTALAke Backend Plan

1db should not be reduced to SQL Server. SQL Server is the control ledger inside TALA; the daTALAke should be able to route cognition data across purpose-fit stores.

## Backend Roles

| Backend role | Purpose | Initial state |
| --- | --- | --- |
| `control-sql` | Tenant-scoped metadata, governance, continuity summaries, jobs, audit, provider registry | SQL Server `Nrun`, schema `onedb` |
| `event-object` | Append-only raw events, transcripts, payload snapshots, large source artifacts | Future object/N2/R2-compatible store |
| `vector` | Embeddings and nearest-neighbor recall | Future pgvector/Qdrant/other provider |
| `graph` | Entity, relationship, causality, identity, temporal links | SQL edge table first, graph provider later |
| `search` | Lexical/BM25/hybrid recall | SQL lexical first, dedicated index later |
| `hot-cache` | Active context, queue locks, short-lived retrieval/cache packets | VELO/Redis |

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
