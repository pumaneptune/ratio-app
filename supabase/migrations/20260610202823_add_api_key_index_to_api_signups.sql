-- Fast lookup by api_key during request authentication
CREATE INDEX IF NOT EXISTS api_signups_api_key_idx ON api_signups (api_key);
