Set-Location $PSScriptRoot\..
try { docker compose exec api pytest -q } catch {}
try { docker compose exec frontend npm test -- --watch=false } catch {}
