# StockSprint – “Did I do everything right?” checklist

## Your project (verified)

- **API_BASE** in `index.html`: set to `https://rifgcpscgxkqbkkcxouw.supabase.co/functions/v1`
- **API_ANON_KEY** in `index.html`: set (anon JWT present)
- **apiHeaders()** and all fetch calls use the anon key
- **Supabase**: 5 functions (`prices`, `create`, `join`, `submit`, `leaderboard`), 1 migration

## What you must do on your end

### 1. Supabase CLI login (one time)

In a terminal:

```bash
npx supabase login
```

Browser opens; sign in and allow access.

### 2. Run the database migration (one time)

- Open [Supabase Dashboard](https://supabase.com/dashboard) → your project **rifgcpscgxkqbkkcxouw**
- Go to **SQL Editor** → **New query**
- Copy the **entire** contents of `supabase/migrations/20250207000000_initial.sql`
- Paste into the editor → **Run**
- You should see “Success” and tables `games` and `scores` in **Table Editor**

### 3. Deploy the Edge Functions

From the **project root** (folder that contains `supabase/` and `index.html`):

**Option A – PowerShell (Windows)**  
```powershell
.\deploy-supabase.ps1
```

**Option B – Manual**  
```bash
npx supabase link --project-ref rifgcpscgxkqbkkcxouw
npx supabase functions deploy prices
npx supabase functions deploy create
npx supabase functions deploy join
npx supabase functions deploy submit
npx supabase functions deploy leaderboard
```

### 4. Host or open the frontend

- **Local:** Open `index.html` in a browser (file://) or run a static server, e.g.  
  `npx serve .`  
  then open the URL shown (e.g. http://localhost:3000).
- **Online:** Upload `index.html` (and keep `API_BASE` / `API_ANON_KEY` as they are) to any static host (Vercel, Netlify, GitHub Pages, etc.).

## Quick test

1. Open the app (local or hosted).
2. **Play Solo** – chart should load (prices from your Supabase `prices` function or fallback).
3. **Create Game** – should show a room code (if it says “No server” or errors, functions aren’t deployed or anon key is wrong).
4. **Join Game** – enter that code; you should enter the game.
5. After a round, leaderboard should show (if **submit** and **leaderboard** are deployed and migration was run).

## If something fails

- **“No server” / Create or Join fails**  
  - Functions not deployed → run step 3.  
  - Wrong or missing anon key → Dashboard → Project Settings → API → copy **anon public** into `API_ANON_KEY` in `index.html`.

- **CORS or 401 in browser console**  
  - Confirm `API_ANON_KEY` is set and matches the **anon public** key in the dashboard.

- **Leaderboard empty or submit fails**  
  - Run the migration (step 2) so `games` and `scores` tables exist and RLS policies are in place.
