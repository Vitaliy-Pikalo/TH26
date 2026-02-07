# Deploy StockSprint backend to Supabase
# Run once: npx supabase login
# Then run this script from the project root.

$ErrorActionPreference = "Stop"
$projectRef = "rifgcpscgxkqbkkcxouw"

Write-Host "Linking project..." -ForegroundColor Cyan
npx supabase link --project-ref $projectRef

Write-Host "Deploying Edge Functions..." -ForegroundColor Cyan
npx supabase functions deploy prices
npx supabase functions deploy create
npx supabase functions deploy join
npx supabase functions deploy submit
npx supabase functions deploy leaderboard

Write-Host "Done. Test: Play Solo or Create Game in the app." -ForegroundColor Green
