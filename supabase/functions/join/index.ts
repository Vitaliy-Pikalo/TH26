import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "npm:@supabase/supabase-js@2";

const ALLOWED_ORIGINS = [
  "https://flashtrades.netlify.app",
  "http://localhost:3000",
  "http://127.0.0.1:3000",
];
function corsHeaders(req: Request): Record<string, string> {
  const origin = req.headers.get("Origin") ?? "";
  const allow = ALLOWED_ORIGINS.includes(origin) ? origin : ALLOWED_ORIGINS[0];
  return {
    "Access-Control-Allow-Origin": allow,
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
  };
}

Deno.serve(async (req: Request) => {
  const CORS = corsHeaders(req);
  if (req.method === "OPTIONS") return new Response(null, { headers: CORS });

  let body: { code?: string };
  try {
    body = await req.json();
  } catch {
    return new Response(
      JSON.stringify({ error: "Invalid JSON" }),
      { status: 400, headers: { ...CORS, "Content-Type": "application/json" } }
    );
  }

  const code = String(body?.code ?? "").trim().toUpperCase();
  if (!code) {
    return new Response(
      JSON.stringify({ error: "Missing code" }),
      { status: 400, headers: { ...CORS, "Content-Type": "application/json" } }
    );
  }

  const supabase = createClient(
    Deno.env.get("SUPABASE_URL") ?? "",
    Deno.env.get("SUPABASE_ANON_KEY") ?? ""
  );

  const { data, error } = await supabase
    .from("games")
    .select("code")
    .eq("code", code)
    .single();

  if (error || !data) {
    return new Response(
      JSON.stringify({ error: "Game not found" }),
      { status: 404, headers: { ...CORS, "Content-Type": "application/json" } }
    );
  }

  return new Response(
    JSON.stringify({ gameId: data.code }),
    { headers: { ...CORS, "Content-Type": "application/json" } }
  );
});
