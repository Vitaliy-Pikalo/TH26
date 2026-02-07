# FlashTrades backend (Supabase)

Multiplayer uses **Supabase Realtime** (host/join in the browser). Optional: **submit** Edge Function saves scores to the DB.

## 1. Create a Supabase project

1. Go to [supabase.com](https://supabase.com) and sign in.
2. **New project** → pick org, name, database password, region.

## 2. Run the database migration

From the project root:

```bash
supabase login
supabase link --project-ref YOUR_PROJECT_REF
supabase db push
```

Or run the SQL by hand: Dashboard → **SQL Editor** → paste `migrations/20250207000000_initial.sql` and `20250208000000_add_public.sql` → Run.

## 3. Deploy Edge Functions (optional)

Only **submit** is used (saves score when game ends). From project root:

```bash
npx supabase functions deploy submit
```

Or run `deploy-supabase.ps1`.

## 4. Frontend

In `index.html` set **API_ANON_KEY** (Dashboard → Settings → API → anon public). Required for Realtime (host/join) and for the submit call.

## API used

| Call | Function | Purpose |
|------|----------|---------|
| `POST /submit` body `{ score, name, gameId? }` | `submit` | Saves score to DB. |

Host/join and live leaderboard use **Supabase Realtime** (no create/join/open-games endpoints).
