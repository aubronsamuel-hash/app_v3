Push-Location "$PSScriptRoot/../backend"
pytest -q
Pop-Location

Push-Location "$PSScriptRoot/../frontend"
npm install
npm run build
Pop-Location
