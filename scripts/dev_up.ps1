Push-Location (Join-Path $PSScriptRoot '..')
docker compose --profile dev up -d
Pop-Location
