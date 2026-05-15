ALTER TABLE memory_atoms ADD COLUMN reinforcement_count INTEGER NOT NULL DEFAULT 0;
ALTER TABLE memory_atoms ADD COLUMN last_reinforced_at TEXT;
ALTER TABLE memory_atoms ADD COLUMN stale_after TEXT;
ALTER TABLE memory_atoms ADD COLUMN quality_flags TEXT NOT NULL DEFAULT '[]';
ALTER TABLE memory_atoms ADD COLUMN duplicate_of TEXT;

CREATE TABLE IF NOT EXISTS memory_reinforcements (
  id TEXT PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  memory_id TEXT NOT NULL REFERENCES memory_atoms(id),
  reinforced_by_event_id TEXT REFERENCES cognitive_events(id),
  reason TEXT NOT NULL,
  weight REAL NOT NULL DEFAULT 1.0,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);
CREATE INDEX IF NOT EXISTS idx_reinforcements_memory ON memory_reinforcements(memory_id);
CREATE INDEX IF NOT EXISTS idx_reinforcements_tenant ON memory_reinforcements(tenant_id, memory_id);

CREATE TABLE IF NOT EXISTS contradiction_reports (
  id TEXT PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  candidate_memory_id TEXT,
  conflicting_memory_ids TEXT NOT NULL,
  contradiction_type TEXT NOT NULL,
  recommended_action TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'open',
  detail TEXT,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  resolved_at TEXT
);
CREATE INDEX IF NOT EXISTS idx_contradictions_tenant_status ON contradiction_reports(tenant_id, status);
CREATE INDEX IF NOT EXISTS idx_contradictions_candidate ON contradiction_reports(candidate_memory_id);

CREATE TABLE IF NOT EXISTS memory_merge_links (
  id TEXT PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  source_memory_id TEXT NOT NULL REFERENCES memory_atoms(id),
  target_memory_id TEXT NOT NULL REFERENCES memory_atoms(id),
  reason TEXT NOT NULL,
  similarity REAL NOT NULL DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'linked',
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  UNIQUE(source_memory_id, target_memory_id)
);
CREATE INDEX IF NOT EXISTS idx_merge_links_tenant ON memory_merge_links(tenant_id, target_memory_id);
