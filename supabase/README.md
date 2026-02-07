# StockSprint backend with Supabase

Use Supabase for the database and Edge Functions so you get real prices, Create/Join game, and leaderboards without running your own server.

## 1. Create a Supabase project

1. Go to [supabase.com](https://supabase.com) and sign in.
2. **New project** → pick org, name (e.g. `stocksprint`), database password, region.
3. Wait for the project to be ready.

## 2. Run the database migration

1. Install the [Supabase CLI](https://supabase.com/docs/guides/cli):  
   `npm i -g supabase` or see the docs.
2. In a terminal, from the **project root** (parent of `supabase/`):
   ```bash
   supabase login
   supabase link --project-ref YOUR_PROJECT_REF
   ```
   Find **Project ref** in: Supabase Dashboard → Project Settings → General.
3. Apply the migration:
   ```bash
   supabase db push
   ```
   Or run the SQL by hand: Supabase Dashboard → **SQL Editor** → New query → paste contents of `supabase/migrations/20250207000000_initial.sql` → Run.

## 3. Deploy Edge Functions

From the project root:

```bash
supabase functions deploy prices
supabase functions deploy create
supabase functions deploy join
supabase functions deploy submit
supabase functions deploy leaderboard
```

Or deploy all:

```bash
supabase functions deploy
```

## 4. Point the frontend at your project

In `index.html`:

1. **API_BASE** – already set to your Supabase Functions URL (or set it to `https://YOUR_PROJECT_REF.supabase.co/functions/v1`).
2. **API_ANON_KEY** – set this to your **anon public** key so the browser can call your Edge Functions:
   - Supabase Dashboard → **Project Settings** → **API**
   - Copy **anon public** (starts with `eyJ...`)
   - In `index.html` set: `const API_ANON_KEY='eyJ...';` (paste your key inside the quotes).

Without the anon key, Supabase returns 401 and Create/Join/Prices/Leaderboard will not work.

## 5. Host the frontend

- **Option A:** Put `index.html` on any static host (Vercel, Netlify, GitHub Pages, etc.) and open the page. Leave `API_BASE` as above so the browser calls your Supabase functions.
- **Option B:** Run a local static server (e.g. `npx serve .` or `python -m http.server 8000`) and open the page. Same `API_BASE`; CORS is set on the functions so the browser can call them.

## API used by the frontend

| Frontend call | Supabase Edge Function | Purpose |
|---------------|------------------------|--------|
| `GET /prices?symbol=XXX` | `prices` | Returns 265 daily prices (tries Yahoo; fallback random walk). |
| `POST /create` | `create` | Creates a game room, returns `{ code, gameId }`. |
| `POST /join` body `{ code }` | `join` | Joins by code, returns `{ gameId }`. |
| `POST /submit` body `{ score, name, gameId? }` | `submit` | Saves score to DB. |
| `GET /leaderboard` or `?game=CODE` | `leaderboard` | Returns top 10 scores (global or per game). |

## Tables

- **games** – `code` (PK), `ticker`, `created_at`
- **scores** – `id`, `game_id` (FK to games.code), `name`, `score`, `created_at`

RLS is enabled; the migration adds policies so the Edge Functions (using the anon key) can read/insert as needed.

## Optional: real stock data

The `prices` function first tries Yahoo Finance; if that fails it returns a random walk. For a dedicated stock API (e.g. Alpha Vantage, Polygon), add your key (e.g. in Supabase Dashboard → Project Settings → Edge Functions → Secrets) and change the fetch URL in `supabase/functions/prices/index.ts`.
