Push-Location (Join-Path $PSScriptRoot '..')
docker compose exec api python scripts/seed_plus.py
Pop-Location
