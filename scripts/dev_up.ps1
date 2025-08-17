Push-Location "$PSScriptRoot/../deploy"
docker compose --profile dev up -d
Pop-Location
