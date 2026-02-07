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
    "Access-Control-Allow-Methods": "GET, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
  };
}

const BOT_TICKERS = ["AAPL", "NVDA", "AMZN", "TSLA", "GME"];
function code4() {
  return String(1000 + Math.floor(Math.random() * 9000));
}

Deno.serve(async (req: Request) => {
  const CORS = corsHeaders(req);
  if (req.method === "OPTIONS") return new Response(null, { headers: CORS });

  const supabase = createClient(
    Deno.env.get("SUPABASE_URL") ?? "",
    Deno.env.get("SUPABASE_ANON_KEY") ?? ""
  );

  const since = new Date(Date.now() - 15 * 60 * 1000).toISOString();
  let { data, error } = await supabase
    .from("games")
    .select("code")
    .eq("public", true)
    .gte("created_at", since)
    .order("created_at", { ascending: false })
    .limit(20);

  if (error) {
    return new Response(
      JSON.stringify([]),
      { headers: { ...CORS, "Content-Type": "application/json" } }
    );
  }

  let codes = (data ?? []).map((r: { code: string }) => r.code);

  // If no public games, seed 5 bot games so "Play Online" always has something to join
  if (codes.length === 0) {
    const used = new Set<string>();
    for (let i = 0; i < 5; i++) {
      let c = code4();
      while (used.has(c)) c = code4();
      used.add(c);
      const ticker = BOT_TICKERS[i % BOT_TICKERS.length];
      await supabase.from("games").insert({
        code: c,
        ticker,
        public: true,
      });
    }
    const res = await supabase
      .from("games")
      .select("code")
      .eq("public", true)
      .gte("created_at", since)
      .order("created_at", { ascending: false })
      .limit(20);
    codes = (res.data ?? []).map((r: { code: string }) => r.code);
  }

  return new Response(JSON.stringify(codes), {
    headers: { ...CORS, "Content-Type": "application/json" },
  });
});
