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

function code4() {
  return String(1000 + Math.floor(Math.random() * 9000));
}

Deno.serve(async (req: Request) => {
  const CORS = corsHeaders(req);
  if (req.method === "OPTIONS") return new Response(null, { headers: CORS });

  let body: { public?: boolean } = {};
  try {
    if (req.method === "POST" && req.body) body = await req.json();
  } catch {}
  const isPublic = body?.public === true;

  const supabase = createClient(
    Deno.env.get("SUPABASE_URL") ?? "",
    Deno.env.get("SUPABASE_ANON_KEY") ?? ""
  );

  const tickers = ["AAPL", "TSLA", "NVDA", "AMD", "GME"];
  const ticker = tickers[Math.floor(Math.random() * tickers.length)];
  const c = code4();

  const { error } = await supabase.from("games").insert({ code: c, ticker, public: isPublic });

  if (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...CORS, "Content-Type": "application/json" } }
    );
  }

  return new Response(
    JSON.stringify({ code: c, gameId: c }),
    { headers: { ...CORS, "Content-Type": "application/json" } }
  );
});
