CREATE TABLE IF NOT EXISTS aliases (
  id TEXT PRIMARY KEY, public_code TEXT NOT NULL UNIQUE, namespace TEXT NOT NULL, slug TEXT NOT NULL,
  canonical_short_url TEXT NOT NULL, target_url TEXT NOT NULL, target_type TEXT, target_vertex_id TEXT,
  tenant_id TEXT, tenant_slug TEXT, owner_account_id TEXT, mode TEXT NOT NULL DEFAULT 'redirect', redirect_status_code INTEGER NOT NULL DEFAULT 302,
  preserve_query_string INTEGER NOT NULL DEFAULT 1, append_query_string TEXT, utm_config TEXT, is_active INTEGER NOT NULL DEFAULT 1,
  created_utc TEXT NOT NULL, updated_utc TEXT NOT NULL, expires_utc TEXT, max_views INTEGER, max_successful_actions INTEGER,
  view_count INTEGER NOT NULL DEFAULT 0, success_count INTEGER NOT NULL DEFAULT 0, last_access_utc TEXT, metadata TEXT NOT NULL DEFAULT '{}'
);
CREATE INDEX IF NOT EXISTS idx_alias_lookup ON aliases(namespace, slug);
CREATE INDEX IF NOT EXISTS idx_alias_public_code ON aliases(public_code);
CREATE TABLE IF NOT EXISTS alias_policies (
  id TEXT PRIMARY KEY, alias_id TEXT NOT NULL UNIQUE REFERENCES aliases(id) ON DELETE CASCADE,
  require_password INTEGER NOT NULL DEFAULT 0, password_hash TEXT, require_bearer_token INTEGER NOT NULL DEFAULT 0, token_hash TEXT,
  require_signed_url INTEGER NOT NULL DEFAULT 0, require_sso INTEGER NOT NULL DEFAULT 0, sso_provider TEXT,
  allowed_origins TEXT, allowed_referrers TEXT, allowed_countries TEXT, denied_countries TEXT, allowed_ips TEXT, denied_ips TEXT,
  allowed_methods TEXT, block_bots INTEGER NOT NULL DEFAULT 0, block_likely_bots_for_post INTEGER NOT NULL DEFAULT 1,
  require_turnstile_for_post INTEGER NOT NULL DEFAULT 0, one_time_use INTEGER NOT NULL DEFAULT 0, notes TEXT
);
CREATE TABLE IF NOT EXISTS alias_events (
  id TEXT PRIMARY KEY, alias_id TEXT, event_type TEXT NOT NULL, timestamp_utc TEXT NOT NULL, method TEXT, path TEXT,
  redacted_query TEXT, ip_hash TEXT, country TEXT, colo TEXT, user_agent_hash TEXT, user_agent_summary TEXT, referrer_host TEXT,
  origin TEXT, status_code INTEGER, decision TEXT NOT NULL, reason TEXT, latency_ms INTEGER, request_id TEXT
);
CREATE INDEX IF NOT EXISTS idx_events_alias_time ON alias_events(alias_id, timestamp_utc DESC);
CREATE TABLE IF NOT EXISTS audit_events (id TEXT PRIMARY KEY, timestamp_utc TEXT NOT NULL, actor TEXT, action TEXT NOT NULL, alias_id TEXT, detail TEXT);
