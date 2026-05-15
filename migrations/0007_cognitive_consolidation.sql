CREATE TABLE IF NOT EXISTS consolidation_jobs(id TEXT PRIMARY KEY,tenant_id TEXT NOT NULL,scope_type TEXT NOT NULL,scope_id TEXT,status TEXT NOT NULL DEFAULT 'completed',result TEXT,error TEXT,created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP);
CREATE INDEX IF NOT EXISTS idx_consolidation_jobs_scope ON consolidation_jobs(tenant_id,scope_type,scope_id,created_at DESC);
CREATE TABLE IF NOT EXISTS memory_quality_metrics(id TEXT PRIMARY KEY,tenant_id TEXT NOT NULL,scope_type TEXT NOT NULL,scope_id TEXT,metrics TEXT NOT NULL,created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP);
CREATE INDEX IF NOT EXISTS idx_memory_quality_metrics_scope ON memory_quality_metrics(tenant_id,scope_type,scope_id,created_at DESC);
CREATE TABLE IF NOT EXISTS memory_resurfacing_triggers(id TEXT PRIMARY KEY,tenant_id TEXT NOT NULL,memory_id TEXT NOT NULL,trigger_query TEXT,reason TEXT,created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP);
CREATE INDEX IF NOT EXISTS idx_memory_resurfacing_triggers_memory ON memory_resurfacing_triggers(tenant_id,memory_id,created_at DESC);
CREATE TABLE IF NOT EXISTS context_packets(id TEXT PRIMARY KEY,tenant_id TEXT NOT NULL,actor_id TEXT NOT NULL,project_id TEXT,query TEXT,intent TEXT,packet TEXT NOT NULL,token_estimate INTEGER NOT NULL DEFAULT 0,created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP);
CREATE INDEX IF NOT EXISTS idx_context_packets_project ON context_packets(tenant_id,project_id,created_at DESC);
