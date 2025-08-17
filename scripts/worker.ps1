Push-Location (Join-Path $PSScriptRoot '..\backend')
python -m app.services.notifications --worker
Pop-Location
