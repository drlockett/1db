CREATE TABLE IF NOT EXISTS cognitive_jobs(id TEXT PRIMARY KEY,tenant_id TEXT NOT NULL,type TEXT NOT NULL,payload TEXT NOT NULL,status TEXT NOT NULL DEFAULT 'queued',attempts INTEGER NOT NULL DEFAULT 0,last_error TEXT,run_after TEXT,created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP);
CREATE INDEX IF NOT EXISTS idx_cognitive_jobs_status ON cognitive_jobs(tenant_id,status,run_after,created_at);
CREATE TABLE IF NOT EXISTS cognitive_dead_letters(id TEXT PRIMARY KEY,tenant_id TEXT NOT NULL,job_id TEXT,type TEXT NOT NULL,payload TEXT,error TEXT NOT NULL,created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP);
CREATE INDEX IF NOT EXISTS idx_cognitive_dead_letters_tenant ON cognitive_dead_letters(tenant_id,created_at DESC);
CREATE TABLE IF NOT EXISTS cognitive_metrics(id TEXT PRIMARY KEY,tenant_id TEXT NOT NULL,metric_name TEXT NOT NULL,metric_value REAL NOT NULL,labels TEXT,created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP);
CREATE INDEX IF NOT EXISTS idx_cognitive_metrics_name ON cognitive_metrics(tenant_id,metric_name,created_at DESC);
CREATE TABLE IF NOT EXISTS ingestion_idempotency_keys(tenant_id TEXT NOT NULL,idempotency_key TEXT NOT NULL,event_id TEXT NOT NULL,response TEXT,created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,PRIMARY KEY(tenant_id,idempotency_key));
CREATE INDEX IF NOT EXISTS idx_ingestion_idempotency_event ON ingestion_idempotency_keys(tenant_id,event_id);
