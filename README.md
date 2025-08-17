# Coulisses Crew Ultra V2

Monorepo with FastAPI backend, Vite/Tailwind frontend and Docker tooling.

## Prerequisites

- [Docker Desktop](https://www.docker.com/products/docker-desktop)
- [PowerShell 7](https://learn.microsoft.com/powershell/)
- [Node.js LTS](https://nodejs.org/)
- [Python 3.11](https://www.python.org/)

## Quickstart (PowerShell)

```powershell
cp .env.example .env
pwsh scripts/dev_up.ps1
pwsh scripts/seed.ps1
pwsh scripts/test_all.ps1
pwsh scripts/dev_down.ps1
```

## Environment variables

| Variable | Service | Default |
| --- | --- | --- |
| `API_PORT` | API | `8001` |
| `FRONT_PORT` | Frontend | `5173` |
| `CADDY_HTTP_PORT` | Proxy | `8080` |
| `POSTGRES_DB` | Postgres | `appdb` |
| `POSTGRES_USER` | Postgres | `postgres` |
| `POSTGRES_PASSWORD` | Postgres | `postgres` |
| `POSTGRES_HOST` | Postgres | `postgres` |
| `POSTGRES_PORT` | Postgres | `5432` |
| `DATABASE_URL` | API | `postgresql+asyncpg://postgres:postgres@db/postgres` |
| `REDIS_URL` | API/Worker | `redis://redis:6379/0` |
| `S3_ENDPOINT` | API | *(empty)* |
| `S3_BUCKET` | API | *(empty)* |
| `S3_ACCESS_KEY` | API | *(empty)* |
| `S3_SECRET_KEY` | API | *(empty)* |
| `ALLOWED_ORIGINS` | API | `http://localhost:5173` |
| `CORS_ORIGINS` | API | `http://localhost:5173` |
| `TRUSTED_HOSTS` | API | `localhost` |
| `SECRET_KEY` | API | `supersecret` |
| `TOKEN_TTL_MIN` | API | `60` |
| `ACCESS_TOKEN_EXPIRE` | API | `60` |
| `RATE_LIMITS_WRITE` | API | `10/minute` |
| `RATE_LIMITS_LOGIN` | API | `5/minute` |
| `LOG_LEVEL` | All | `info` |
| `VITE_API_BASE` | Frontend | `http://127.0.0.1:8001` |

## Dev tasks

### Tests
```powershell
pwsh scripts/test_all.ps1
```

### Seed data
```powershell
pwsh scripts/seed.ps1
```

### Performance
```powershell
docker run --rm -v ${PWD}/perf:/perf grafana/k6 run /perf/load.js
```

### Observability
```powershell
docker compose --profile obs up -d
```
Grafana: http://localhost:3000 (admin/admin)

## Troubleshooting

- **Ports**: adjust `*_PORT` variables or stop conflicting services.
- **Volumes**: `docker compose down -v` resets Postgres/Redis data.
- **Migrations**: `docker compose exec api alembic upgrade head`.

## Production

```powershell
pwsh scripts/deploy_prod.ps1 -host user@server
```
Recommended sizes:
- Dev/small team: 2 vCPU, 4 GB RAM (~$20/mo on most clouds)
- Production: 4 vCPU, 8 GB RAM and managed Postgres/Redis

Rollback:
```powershell
pwsh scripts/rollback.ps1 -host user@server
```
