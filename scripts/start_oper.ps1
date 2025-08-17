Set-StrictMode -Version Latest
$ErrorActionPreference = "Stop"
Set-Location $PSScriptRoot\..
docker compose up -d --build
docker compose ps
docker compose logs api --tail=200
