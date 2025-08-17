Push-Location (Join-Path $PSScriptRoot '..')
docker compose exec api python scripts/seed_plus.py --all
if ($env:DATA_JSON) {
    docker compose exec -e DATA_JSON=$env:DATA_JSON api python backend/scripts/migrate_from_json.py
}
Pop-Location
