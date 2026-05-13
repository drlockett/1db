CREATE TABLE IF NOT EXISTS tenants (
  id TEXT PRIMARY KEY, slug TEXT NOT NULL UNIQUE, name TEXT NOT NULL, allowed_origins TEXT NOT NULL DEFAULT '[]',
  rate_limit_per_minute INTEGER NOT NULL DEFAULT 120, usage_limit_monthly INTEGER NOT NULL DEFAULT 100000,
  billing_tier TEXT NOT NULL DEFAULT 'launch', is_active INTEGER NOT NULL DEFAULT 1, created_utc TEXT NOT NULL, updated_utc TEXT NOT NULL
);
CREATE TABLE IF NOT EXISTS api_keys (
  id TEXT PRIMARY KEY, tenant_id TEXT NOT NULL REFERENCES tenants(id) ON DELETE CASCADE, name TEXT NOT NULL,
  key_prefix TEXT NOT NULL, key_hash TEXT NOT NULL UNIQUE, scopes TEXT NOT NULL DEFAULT '[]', is_active INTEGER NOT NULL DEFAULT 1,
  created_utc TEXT NOT NULL, updated_utc TEXT NOT NULL, last_used_utc TEXT, revoked_utc TEXT
);
CREATE TABLE IF NOT EXISTS routes (
  id TEXT PRIMARY KEY, tenant_id TEXT NOT NULL REFERENCES tenants(id) ON DELETE CASCADE, public_path TEXT NOT NULL UNIQUE,
  type TEXT NOT NULL, target_url TEXT, allowed_methods TEXT NOT NULL DEFAULT '["GET","POST"]', auth_policy TEXT NOT NULL DEFAULT '{}',
  cors_policy TEXT NOT NULL DEFAULT '{}', origin_restrictions TEXT NOT NULL DEFAULT '[]', rate_limit_per_minute INTEGER,
  request_logging INTEGER NOT NULL DEFAULT 1, bot_protection INTEGER NOT NULL DEFAULT 1, persist_payload INTEGER NOT NULL DEFAULT 0,
  static_status INTEGER NOT NULL DEFAULT 200, static_body TEXT, is_active INTEGER NOT NULL DEFAULT 1, created_utc TEXT NOT NULL, updated_utc TEXT NOT NULL, metadata TEXT NOT NULL DEFAULT '{}'
);
CREATE TABLE IF NOT EXISTS intakes (
  id TEXT PRIMARY KEY, tenant_id TEXT NOT NULL REFERENCES tenants(id) ON DELETE CASCADE, slug TEXT NOT NULL,
  public_path TEXT NOT NULL UNIQUE, name TEXT NOT NULL, schema_json TEXT NOT NULL DEFAULT '{}', allowed_origins TEXT NOT NULL DEFAULT '[]',
  bot_protection INTEGER NOT NULL DEFAULT 1, honeypot_field TEXT, is_active INTEGER NOT NULL DEFAULT 1,
  created_utc TEXT NOT NULL, updated_utc TEXT NOT NULL, metadata TEXT NOT NULL DEFAULT '{}', UNIQUE(tenant_id, slug)
);
CREATE TABLE IF NOT EXISTS intake_submissions (
  id TEXT PRIMARY KEY, intake_id TEXT NOT NULL REFERENCES intakes(id) ON DELETE CASCADE, tenant_id TEXT NOT NULL,
  timestamp_utc TEXT NOT NULL, payload_json TEXT NOT NULL, payload_hash TEXT NOT NULL, ip_hash TEXT, user_agent_hash TEXT,
  user_agent_summary TEXT, origin TEXT, referrer_host TEXT, country TEXT, request_id TEXT
);
CREATE INDEX IF NOT EXISTS idx_submissions_intake_time ON intake_submissions(intake_id, timestamp_utc DESC);
ALTER TABLE aliases ADD COLUMN api_tenant_id TEXT;
ALTER TABLE aliases ADD COLUMN tags TEXT NOT NULL DEFAULT '[]';
ALTER TABLE aliases ADD COLUMN notes TEXT;
INSERT OR IGNORE INTO tenants(id,slug,name,allowed_origins,rate_limit_per_minute,usage_limit_monthly,billing_tier,is_active,created_utc,updated_utc)
VALUES('tenant_nodevertex','nodevertex','Node Vertex','["https://nodevertex.com","https://nrun.global"]',600,1000000,'enterprise',1,datetime('now'),datetime('now'));
