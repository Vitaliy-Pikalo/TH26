import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "npm:@supabase/supabase-js@2";

const CORS = {
  "Access-Control-Allow-Origin": "https://flashtrades.netlify.app",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: CORS });

  let body: { score?: number; name?: string; gameId?: string };
  try {
    body = await req.json();
  } catch {
    return new Response(null, { status: 400, headers: CORS });
  }

  const score = Number(body?.score ?? 0);
  const name = String(body?.name ?? "Player").slice(0, 50);
  const gameId = body?.gameId ? String(body.gameId).trim() : null;

  const supabase = createClient(
    Deno.env.get("SUPABASE_URL") ?? "",
    Deno.env.get("SUPABASE_ANON_KEY") ?? ""
  );

  await supabase.from("scores").insert({ game_id: gameId, name, score });

  return new Response(JSON.stringify({ ok: true }), {
    headers: { ...CORS, "Content-Type": "application/json" },
  });
});
