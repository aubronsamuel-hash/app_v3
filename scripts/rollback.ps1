param([string]$host)
ssh $host "cd /opt/coulisses && docker compose --profile prod down && docker compose --profile prod up -d"
