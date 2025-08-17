param([string]$host)

Push-Location "$PSScriptRoot/../deploy"
docker compose --profile prod build
docker compose --profile prod push
ssh $host "cd /opt/coulisses && docker compose --profile prod pull && docker compose --profile prod up -d"
Pop-Location
