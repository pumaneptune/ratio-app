export const API_BASE_URL: string = (
  (import.meta.env.VITE_API_BASE_URL as string | undefined) ||
  "https://api.verifyproceed.com"
).replace(/\/+$/, "");

// Supabase edge functions share the api_signups key store with api-key-signup.
// Auth-gated endpoints (signup, guard) route here so a key issued by signup
// is immediately valid on guard — both hit the same table.
const _supabaseUrl = (
  (import.meta.env.VITE_SUPABASE_URL as string | undefined) || ""
).replace(/\/+$/, "");
export const SUPABASE_FUNCTIONS_URL = `${_supabaseUrl}/functions/v1`;

export const ENDPOINTS = {
  // Render — public, no auth
  HEALTH:       "/health",
  CAPABILITIES: "/v1/capabilities",
  AGENTS:       "/v1/agents",
  ACP_GUARD:    "/v1/acp/guard",
  ACP_DECIDE:   "/v1/acp/decide",
  ORACLE:       "/v1/oracle",
  // Supabase edge functions — full URLs, auth validated against api_signups
  API_KEY_SIGNUP: `${_supabaseUrl}/functions/v1/api-key-signup`,
  GUARD:          `${_supabaseUrl}/functions/v1/guard`,
  ORACLE_FN:      `${_supabaseUrl}/functions/v1/oracle`,
} as const;
