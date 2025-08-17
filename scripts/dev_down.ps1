Push-Location (Join-Path $PSScriptRoot '..')
docker compose --profile dev down
Pop-Location
