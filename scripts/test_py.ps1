Set-StrictMode -Version Latest
$ErrorActionPreference = "Stop"
Set-Location $PSScriptRoot\..
try {
  docker compose exec api pytest -q
} catch {
  Write-Host "pytest failed or not installed"
  exit 1
}
