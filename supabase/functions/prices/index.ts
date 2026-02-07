import "jsr:@supabase/functions-js/edge-runtime.d.ts";

const CORS = {
  "Access-Control-Allow-Origin": "https://flashtrades.netlify.app",
  "Access-Control-Allow-Methods": "GET, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

function randomWalk(len: number): number[] {
  let v = 100;
  const a: number[] = [];
  for (let i = 0; i < len; i++) {
    v += (Math.random() - 0.48) * 4;
    v = Math.max(20, v);
    a.push(v);
  }
  return a;
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: CORS });

  try {
    const url = new URL(req.url);
    const symbol = url.searchParams.get("symbol") || "AAPL";
    let prices: number[] = randomWalk(265);
    try {
      const res = await fetch(
        `https://query1.finance.yahoo.com/v8/finance/chart/${symbol}?interval=1d&range=1y`,
        { headers: { "User-Agent": "StockSprint/1.0" } }
      );
      if (res.ok) {
        const data = await res.json();
        const quotes = data?.chart?.result?.[0]?.indicators?.quote?.[0]?.close;
        if (Array.isArray(quotes) && quotes.length >= 265) {
          prices = quotes.slice(-265).map((p: number) => (p != null ? p : 100));
        }
      }
    } catch {
      /* use randomWalk */
    }
    return new Response(JSON.stringify(prices), {
      headers: { ...CORS, "Content-Type": "application/json" },
    });
  } catch {
    return new Response(JSON.stringify(randomWalk(265)), {
      headers: { ...CORS, "Content-Type": "application/json" },
    });
  }
});
