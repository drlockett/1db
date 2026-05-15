CREATE TABLE IF NOT EXISTS memory_governance_events(id TEXT PRIMARY KEY,tenant_id TEXT NOT NULL,actor_id TEXT NOT NULL,memory_id TEXT,action TEXT NOT NULL,detail TEXT,created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP);
CREATE INDEX IF NOT EXISTS idx_memory_governance_events_memory ON memory_governance_events(tenant_id,memory_id,created_at DESC);
CREATE TABLE IF NOT EXISTS memory_deletion_requests(id TEXT PRIMARY KEY,tenant_id TEXT NOT NULL,actor_id TEXT NOT NULL,subject_id TEXT,memory_id TEXT,status TEXT NOT NULL DEFAULT 'completed',reason TEXT,created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,completed_at TEXT);
CREATE INDEX IF NOT EXISTS idx_memory_deletion_requests_subject ON memory_deletion_requests(tenant_id,subject_id,created_at DESC);
CREATE TABLE IF NOT EXISTS tenant_governance_config(tenant_id TEXT PRIMARY KEY,config TEXT NOT NULL,updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP);
CREATE TABLE IF NOT EXISTS memory_reviews(id TEXT PRIMARY KEY,tenant_id TEXT NOT NULL,memory_id TEXT NOT NULL,status TEXT NOT NULL DEFAULT 'pending',reviewer_actor_id TEXT,reason TEXT,created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP);
CREATE INDEX IF NOT EXISTS idx_memory_reviews_status ON memory_reviews(tenant_id,status,created_at DESC);
CREATE TABLE IF NOT EXISTS memory_exports(id TEXT PRIMARY KEY,tenant_id TEXT NOT NULL,subject_id TEXT,requested_by TEXT NOT NULL,status TEXT NOT NULL DEFAULT 'completed',payload TEXT NOT NULL,created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP);
CREATE INDEX IF NOT EXISTS idx_memory_exports_subject ON memory_exports(tenant_id,subject_id,created_at DESC);
