Push-Location (Join-Path $PSScriptRoot '..' 'backend')
pytest -q
Pop-Location

Push-Location (Join-Path $PSScriptRoot '..' 'frontend')
npm ci
npm run build
npx playwright test
Pop-Location

k6 run perf/smoke.js | Out-Null

if (Test-Path 'perf/reports/index.html') {
  Write-Host 'OK'
} else {
  Write-Error 'perf/reports/index.html not found'
}
