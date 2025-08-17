Push-Location (Join-Path $PSScriptRoot '..' 'backend')
pytest -q
Pop-Location

Push-Location (Join-Path $PSScriptRoot '..' 'frontend')
npm test
Pop-Location
