# 1db Cognitive Persistence MVP

Phase 1 implements project cognitive continuity on the existing Cloudflare Worker + D1 stack.

## Flow

Raw interaction -> cognitive event -> rule-extracted memory candidates -> memory atoms -> evidence links -> entity/edge updates -> lexical semantic index -> continuity state -> context retrieval.

## Endpoints

- `POST /api/v1/cognition/events`
- `POST /api/v1/cognition/context/retrieve`
- `GET /api/v1/cognition/projects/{projectId}/continuity`
- `GET /api/v1/cognition/memories/{memoryId}/explain`
- `PATCH /api/v1/cognition/memories/{memoryId}/correct`
- `PATCH /api/v1/cognition/memories/{memoryId}/deprecate`

`/v1/*` aliases are also available for the same cognition endpoints.

## MVP limitations

- Uses Cloudflare D1, not PostgreSQL/pgvector.
- Uses lexical semantic indexing in `memory_embeddings.embedding_json`; vector provider integration is Phase 2+.
- Extraction is rule-based and conservative.
- Graph expansion is stored but retrieval graph-neighborhood assembly is minimal in Phase 1.
