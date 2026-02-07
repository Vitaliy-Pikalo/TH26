import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "npm:@supabase/supabase-js@2";

const CORS = {
  "Access-Control-Allow-Origin": "https://flashtrades.netlify.app",
  "Access-Control-Allow-Methods": "GET, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: CORS });

  const url = new URL(req.url);
  const gameId = url.searchParams.get("game");

  const supabase = createClient(
    Deno.env.get("SUPABASE_URL") ?? "",
    Deno.env.get("SUPABASE_ANON_KEY") ?? ""
  );

  let query = supabase
    .from("scores")
    .select("name, score")
    .order("score", { ascending: false })
    .limit(10);

  if (gameId) {
    query = query.eq("game_id", gameId);
  } else {
    query = query.is("game_id", null);
  }

  const { data, error } = await query;

  if (error) {
    return new Response(
      JSON.stringify([]),
      { headers: { ...CORS, "Content-Type": "application/json" } }
    );
  }

  return new Response(JSON.stringify(data ?? []), {
    headers: { ...CORS, "Content-Type": "application/json" },
  });
});
