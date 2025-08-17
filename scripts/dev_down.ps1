Push-Location "$PSScriptRoot/../deploy"
docker compose --profile dev down
Pop-Location
