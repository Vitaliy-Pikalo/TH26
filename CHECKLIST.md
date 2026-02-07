# FlashTrades – checklist

## Verified

- **API_ANON_KEY** in `index.html`: set (required for Realtime + submit)
- **Supabase**: 1 Edge Function (`submit`), migrations for `games` and `scores`

## What to do

### 1. Database (one time)

Dashboard → SQL Editor → run `migrations/20250207000000_initial.sql` and `20250208000000_add_public.sql`.

### 2. Deploy submit function (optional)

From project root: `.\deploy-supabase.ps1` or  
`npx supabase link --project-ref rifgcpscgxkqbkkcxouw` then  
`npx supabase functions deploy submit`

### 3. Open the app

Local: `npx serve .` then open the URL.  
Online: upload `index.html` to Netlify/Vercel/etc.

## Test

1. **Play** – solo round, chart loads (built-in data).
2. **Host for Friends** – get code, start game (Realtime).
3. **Join with Code** – enter code, wait for host to start.
4. After a round, live leaderboard updates; score is sent to DB if submit is deployed.

## If something fails

- **Set API_ANON_KEY for multiplayer** → Dashboard → Settings → API → copy anon public into `index.html`.
- **Submit / leaderboard** → run migrations and deploy `submit`.
