param([string]$host)
ssh $host "cd /opt/app && docker compose -f compose.prod.yaml down && docker compose -f compose.prod.yaml up -d"
