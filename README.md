# Coulisses Crew Ultra V2

Monorepo containing frontend, backend and deployment tooling.

## Quickstart (Windows PowerShell)

```powershell
powershell -ExecutionPolicy Bypass -File .\scripts\dev_up.ps1
```

To stop services:

```powershell
powershell -ExecutionPolicy Bypass -File .\scripts\dev_down.ps1
```

Seed demo data:

```powershell
powershell -ExecutionPolicy Bypass -File .\scripts\seed.ps1
```

## Environment

Create `.env` from `.env.example` and adjust:

- API_PORT (default 8001)
- FRONT_PORT (5173)
- CADDY_HTTP_PORT (8080)
- POSTGRES_DB, POSTGRES_USER, POSTGRES_PASSWORD, POSTGRES_HOST, POSTGRES_PORT
- REDIS_URL
- S3_ENDPOINT, S3_BUCKET, S3_ACCESS_KEY, S3_SECRET_KEY
- ALLOWED_ORIGINS
- TRUSTED_HOSTS
- TOKEN_TTL_MIN
- RATE_LIMITS_WRITE
- RATE_LIMITS_LOGIN
- LOG_LEVEL

## Ports

- API: http://localhost:8001
- Frontend: http://localhost:5173
- Caddy proxy: http://localhost:8080
- Postgres: 5432
- Redis: 6379
- Grafana: 3000 (obs)
- Prometheus: 9090 (obs)
- cadvisor: 8081 (obs)
- Loki: 3100 (obs)

## Observability

Start the monitoring stack with:

```bash
docker compose --profile obs up -d
```

Grafana is available at http://localhost:3000 with default credentials `admin` / `admin`.
Prebuilt dashboards:

- FastAPI Metrics (`uid: fastapi`)
- cAdvisor Metrics (`uid: cadvisor`)

Make sure the application services are running (e.g. `docker compose --profile dev up -d`) so Prometheus and Loki have data to display.


## Health checks

- API: http://localhost:8001/healthz
- Frontend: http://localhost:5173
- Caddy: http://localhost:8080

## Testing

```powershell
powershell -ExecutionPolicy Bypass -File .\scripts\test_all.ps1
```

## Production

Build and deploy:

```powershell
powershell -ExecutionPolicy Bypass -File .\scripts\deploy_prod.ps1 -host user@server
```

Rollback:

```powershell
powershell -ExecutionPolicy Bypass -File .\scripts\rollback.ps1 -host user@server
```
