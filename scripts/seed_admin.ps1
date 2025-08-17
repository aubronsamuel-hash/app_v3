Set-StrictMode -Version Latest
$ErrorActionPreference = "Stop"
Set-Location $PSScriptRoot\..
docker compose exec db psql -U postgres -d appdb -c `
  "CREATE EXTENSION IF NOT EXISTS pgcrypto;"
docker compose exec db psql -U postgres -d appdb -f /sql/schema.sql
docker compose exec db psql -U postgres -d appdb -f /sql/seed_admin.sql
docker compose exec db psql -U postgres -d appdb -c `
  "SELECT id, username, role, created_at FROM users WHERE username='admin';"
