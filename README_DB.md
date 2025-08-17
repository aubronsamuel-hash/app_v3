# Database Helpers

- Start servers (oper):
  docker compose up -d --build

- Run Python tests:
  docker compose exec api pytest -q
  or: scripts\test_py.ps1

- Force re-apply schema + seed on demand:
  scripts\seed_admin.ps1

- Direct one-liners (without scripts):
  docker compose exec db psql -U postgres -d appdb -f /sql/schema.sql
  docker compose exec db psql -U postgres -d appdb -f /sql/seed_admin.sql
