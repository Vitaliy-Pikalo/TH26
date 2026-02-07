# Deploy FlashTrades backend to Supabase (submit score only)
# Run once: npx supabase login
# Then run this script from the project root.

$ErrorActionPreference = "Stop"
$projectRef = "rifgcpscgxkqbkkcxouw"

Write-Host "Linking project..." -ForegroundColor Cyan
npx supabase link --project-ref $projectRef

Write-Host "Deploying Edge Functions..." -ForegroundColor Cyan
npx supabase functions deploy submit

Write-Host "Done." -ForegroundColor Green
