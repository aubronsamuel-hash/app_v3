# Coulisses Crew Ultra V2

Monorepo containing frontend, backend and deployment tooling.

## Prerequisites
- Docker Desktop with WSL2
- Node.js 18+
- Python 3.11+
- PowerShell 7

## Development (Windows)

```powershell
# start stack
scripts/dev_up.ps1
# seed demo data
scripts/seed.ps1
```
Frontend available at http://localhost:5173, API at http://localhost:8001, Caddy proxy at http://localhost:8080.

To stop:
```powershell
scripts/dev_down.ps1
```

## Testing

```powershell
scripts/test_all.ps1
```

## Production deployment

```powershell
scripts/deploy_prod.ps1 -host user@server
```

Rollback:
```powershell
scripts/rollback.ps1 -host user@server
```

## Migrate from JSON

```powershell
python migrate_from_json.py
```

## Build archives

```powershell
Compress-Archive -Path backend -DestinationPath backend.zip
Compress-Archive -Path frontend -DestinationPath frontend.zip
```
