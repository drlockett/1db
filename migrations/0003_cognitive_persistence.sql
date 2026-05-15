CREATE TABLE IF NOT EXISTS cognitive_events (
  id TEXT PRIMARY KEY,
  type TEXT NOT NULL,
  tenant_id TEXT NOT NULL,
  actor_id TEXT NOT NULL,
  subject_id TEXT,
  session_id TEXT,
  conversation_id TEXT,
  project_id TEXT,
  workflow_id TEXT,
  source_kind TEXT NOT NULL,
  source_id TEXT,
  source_confidence REAL,
  payload TEXT NOT NULL,
  visibility TEXT NOT NULL,
  lineage TEXT,
  audit TEXT NOT NULL,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);
CREATE INDEX IF NOT EXISTS idx_cog_events_project ON cognitive_events(tenant_id, project_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_cog_events_actor ON cognitive_events(tenant_id, actor_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_cog_events_conversation ON cognitive_events(tenant_id, conversation_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_cog_events_type ON cognitive_events(type);
CREATE INDEX IF NOT EXISTS idx_cog_events_created ON cognitive_events(created_at);

CREATE TABLE IF NOT EXISTS memory_atoms (
  id TEXT PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  owner_id TEXT,
  project_id TEXT,
  conversation_id TEXT,
  kind TEXT NOT NULL,
  canonical_text TEXT NOT NULL,
  raw_text TEXT,
  confidence REAL NOT NULL DEFAULT 0.5,
  salience REAL NOT NULL DEFAULT 0.5,
  utility_score REAL,
  emotional_weight REAL,
  status TEXT NOT NULL DEFAULT 'active',
  supersedes TEXT,
  superseded_by TEXT,
  temporal TEXT NOT NULL,
  access TEXT NOT NULL,
  metadata TEXT,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at TEXT NOT NULL DEFAULT (datetime('now'))
);
CREATE INDEX IF NOT EXISTS idx_mem_project ON memory_atoms(tenant_id, project_id, kind, status);
CREATE INDEX IF NOT EXISTS idx_mem_owner ON memory_atoms(tenant_id, owner_id, kind, status);
CREATE INDEX IF NOT EXISTS idx_mem_created ON memory_atoms(tenant_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_mem_status ON memory_atoms(status);
CREATE INDEX IF NOT EXISTS idx_mem_kind ON memory_atoms(kind);

CREATE TABLE IF NOT EXISTS memory_evidence (
  id TEXT PRIMARY KEY,
  memory_id TEXT NOT NULL REFERENCES memory_atoms(id),
  event_id TEXT NOT NULL REFERENCES cognitive_events(id),
  tenant_id TEXT NOT NULL,
  excerpt TEXT,
  evidence_role TEXT NOT NULL DEFAULT 'source',
  confidence REAL NOT NULL DEFAULT 1.0,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);
CREATE INDEX IF NOT EXISTS idx_evidence_memory ON memory_evidence(memory_id);
CREATE INDEX IF NOT EXISTS idx_evidence_event ON memory_evidence(event_id);
CREATE INDEX IF NOT EXISTS idx_evidence_tenant_memory ON memory_evidence(tenant_id, memory_id);

CREATE TABLE IF NOT EXISTS cognitive_entities (
  id TEXT PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  type TEXT NOT NULL,
  name TEXT NOT NULL,
  canonical_name TEXT NOT NULL,
  aliases TEXT,
  metadata TEXT,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at TEXT NOT NULL DEFAULT (datetime('now')),
  UNIQUE(tenant_id, type, canonical_name)
);
CREATE INDEX IF NOT EXISTS idx_cog_entities_type_name ON cognitive_entities(tenant_id, type, canonical_name);
CREATE INDEX IF NOT EXISTS idx_cog_entities_name ON cognitive_entities(tenant_id, canonical_name);

CREATE TABLE IF NOT EXISTS cognitive_edges (
  id TEXT PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  from_node_id TEXT NOT NULL,
  to_node_id TEXT NOT NULL,
  from_node_type TEXT NOT NULL,
  to_node_type TEXT NOT NULL,
  type TEXT NOT NULL,
  confidence REAL NOT NULL DEFAULT 0.5,
  weight REAL NOT NULL DEFAULT 0.5,
  evidence_event_ids TEXT,
  memory_ids TEXT,
  status TEXT NOT NULL DEFAULT 'active',
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at TEXT NOT NULL DEFAULT (datetime('now'))
);
CREATE INDEX IF NOT EXISTS idx_edges_from ON cognitive_edges(tenant_id, from_node_id, type);
CREATE INDEX IF NOT EXISTS idx_edges_to ON cognitive_edges(tenant_id, to_node_id, type);
CREATE INDEX IF NOT EXISTS idx_edges_type ON cognitive_edges(tenant_id, type, status);

CREATE TABLE IF NOT EXISTS continuity_states (
  id TEXT PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  scope_type TEXT NOT NULL,
  scope_id TEXT NOT NULL,
  state TEXT NOT NULL,
  summary TEXT,
  version INTEGER NOT NULL DEFAULT 1,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at TEXT NOT NULL DEFAULT (datetime('now')),
  UNIQUE(tenant_id, scope_type, scope_id)
);

CREATE TABLE IF NOT EXISTS memory_embeddings (
  id TEXT PRIMARY KEY,
  memory_id TEXT NOT NULL REFERENCES memory_atoms(id),
  tenant_id TEXT NOT NULL,
  embedding_json TEXT NOT NULL,
  embedding_model TEXT NOT NULL,
  embedded_text TEXT NOT NULL,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);
CREATE INDEX IF NOT EXISTS idx_embeddings_memory ON memory_embeddings(memory_id);
CREATE INDEX IF NOT EXISTS idx_embeddings_tenant ON memory_embeddings(tenant_id);
