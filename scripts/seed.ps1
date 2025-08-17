Push-Location "$PSScriptRoot/../deploy"
docker compose exec backend python scripts/seed_plus.py
Pop-Location
