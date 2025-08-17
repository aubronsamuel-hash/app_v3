# OPER Setup

To run the stack:

```
cd C:\Users\SAM\app_v4
copy .env.example .env  # if .env not created
docker compose up -d
docker compose logs api --tail=200
scripts\start_oper.ps1
```
