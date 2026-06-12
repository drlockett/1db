# 1db Cognitive Persistence MVP

Phase 1 implements project cognitive continuity on the existing Cloudflare Worker + D1 stack.

## Flow

Raw interaction -> cognitive event -> rule-extracted memory candidates -> memory atoms -> evidence links -> entity/edge updates -> lexical semantic index -> continuity state -> context retrieval.

## Endpoints

- `POST /api/v1/cognition/events`
- `POST /api/v1/cognition/context/retrieve`
- `GET /api/v1/cognition/context/packets/{packetUid}`
- `GET /api/v1/cognition/backends`
- `GET /api/v1/cognition/backends/plan`
- `GET /api/v1/cognition/projects/{projectId}/continuity`
- `GET /api/v1/cognition/memories/{memoryId}/explain`
- `PATCH /api/v1/cognition/memories/{memoryId}/correct`
- `PATCH /api/v1/cognition/memories/{memoryId}/deprecate`

`/v1/*` aliases are also available for the same cognition endpoints.

## MVP limitations

- Uses Cloudflare D1, not PostgreSQL/pgvector.
- Uses SQL lexical recall plus the TALA-owned Qdrant provider path. Qdrant currently receives deterministic bootstrap vectors until the embedding worker phase replaces them with model embeddings.
- Extraction is rule-based and conservative.
- Graph expansion is stored but retrieval graph-neighborhood assembly is minimal in Phase 1.

## NodeRunner phase 2 additions

The Kubernetes runtime proxies 1db cognition through SAPI into TALA. Retrieval now persists context packets in `onedb.ContextPackets`, and backend discovery reads `onedb.StoreBackends` so tenants can see and route across daTALAke roles beyond SQL Server, including operational internal MongoDB document, Qdrant vector, Redis cache, and Jupyter notebook services.

## Phase 2 cognitive integrity additions

Implemented after Phase 1 MVP:

- Duplicate memory candidate linking in `memory_merge_links`.
- Re-mention reinforcement in `memory_reinforcements`.
- Open contradiction reports in `contradiction_reports`.
- Memory quality flags for contradiction and duplicate candidates.
- Reinforcement-aware retrieval ranking.
- Stale and low-confidence warning hooks.
- Graph-neighborhood relationship retrieval around returned memories.
- Project continuity now excludes private user/agent memories.

Run Phase 2 live verification:

```bash
npm run test:cognition:phase2
```

Current limitations:

- Contradiction detection is rule-based.
- Duplicate handling links candidates and reinforces originals; full merge workflow is still future work.
- Stale warnings require `stale_after` to be set by future policy/consolidation jobs.
- Graph context is relationship-level, not yet multi-hop semantic expansion.
