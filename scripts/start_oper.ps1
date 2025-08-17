Set-Location $PSScriptRoot\..
docker compose down
docker compose build --no-cache
docker compose up -d
docker compose ps
docker compose logs api --tail=200
