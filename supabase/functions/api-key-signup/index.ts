import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "npm:@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

function json(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}

function generateApiKey(): string {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let key = "vp_";
  const array = new Uint8Array(32);
  crypto.getRandomValues(array);
  for (const byte of array) {
    key += chars[byte % chars.length];
  }
  return key;
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 200, headers: corsHeaders });
  }

  if (req.method !== "POST") {
    return json({ error: "method_not_allowed" }, 405);
  }

  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return json({ error: "bad_request", message: "Invalid JSON body." }, 400);
  }

  const full_name = String(body.full_name ?? "").trim();
  const email = String(body.email ?? "").trim().toLowerCase();
  const company = String(body.company ?? "").trim();
  const use_case = String(body.use_case ?? "").trim();
  const description = String(body.description ?? "").trim();

  if (!full_name || !email || !use_case) {
    return json({ error: "bad_request", message: "full_name, email, and use_case are required." }, 400);
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return json({ error: "bad_request", message: "Invalid email address." }, 400);
  }

  const supabase = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
  );

  // Return existing key for this email without creating a duplicate
  const { data: existing } = await supabase
    .from("api_signups")
    .select("api_key, plan")
    .eq("email", email)
    .maybeSingle();

  if (existing) {
    return json({
      ok: true,
      api_key: existing.api_key,
      plan: existing.plan ?? "free",
      monthly_limit: 100,
      is_existing: true,
      message: "An API key already exists for this email.",
    });
  }

  const apiKey = generateApiKey();

  const { error: insertError } = await supabase
    .from("api_signups")
    .insert({ full_name, email, company, use_case, description, api_key: apiKey, plan: "free", status: "active" });

  if (insertError) {
    console.error("Insert error:", insertError);
    return json({ error: "internal_error", message: "Failed to create API key." }, 500);
  }

  return json({
    ok: true,
    api_key: apiKey,
    plan: "free",
    monthly_limit: 100,
    is_existing: false,
    message: "API key created successfully.",
  });
});
