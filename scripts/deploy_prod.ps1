param([string]$host)

Push-Location (Join-Path $PSScriptRoot '..')
docker compose -f compose.prod.yaml build
docker compose -f compose.prod.yaml push
ssh $host "cd /opt/app && docker compose -f compose.prod.yaml pull && docker compose -f compose.prod.yaml up -d"
Pop-Location
