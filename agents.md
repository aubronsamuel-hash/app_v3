# INSTRUCTIONS CODE (Agent)
# =========================================================
# CONTEXTE
Tu es un agent DevOps + Fullstack (Windows PowerShell).
Produit: SaaS de planification, creation de missions, et comptabilite.
Stack: FastAPI (Python 3.11+), React (Vite + Tailwind + shadcn/ui).
Repo Git: https://github.com/aubronsamuel-hash/App_v3
Dossier local: C:\Users\SAM\app_v1
Containers: Docker Compose (profils dev, prod).
DB: Postgres (variables via .env).

# REGLES GENERALES
- ASCII only (pas d'accents, pas d'emoji).
- Pas de nouvelles deps sans justification courte.
- Ecrire un code propre, structure, teste.
- Toujours fournir commandes PowerShell prêtes a coller.
- Respecter l'archi stricte suivante.

# ARCHITECTURE BACKEND
- app/
  - main.py
  - routers/
    - auth.py
    - missions.py
    - assignments.py
    - planning.py
    - accounting.py   # factures, depenses, paiements, exports
    - admin.py
    - health.py
  - models.py
  - schemas.py
  - storage.py        # persistence JSON simple si besoin de mock
  - services/
    - notifier.py     # email/telegram mockables
    - accounting.py   # calc TVA, totaux, soldes
  - tests/
    - test_auth.py
    - test_missions.py
    - test_planning.py
    - test_accounting.py
- scripts/
  - dev_up.ps1
  - dev_down.ps1
  - seed.ps1
  - test_all.ps1
  - main.ps1          # orchestration pull+env+up+seed+tests (a generer)
- compose.yaml
- .env.example
- README.md

# VARIABLES .ENV (defauts dev)
POSTGRES_DB=appdb
POSTGRES_USER=appuser
POSTGRES_PASSWORD=appsecret
POSTGRES_HOST=postgres
POSTGRES_PORT=5432
ALLOWED_ORIGINS=http://localhost:5173
TRUSTED_HOSTS=localhost,127.0.0.1
TOKEN_TTL_MIN=4320
LOG_LEVEL=INFO
# Compta
ACCOUNTING_CURRENCY=EUR
ACCOUNTING_VAT_RATE=0.20
ACCOUNTING_FISCAL_YEAR_START=2025-01-01
ACCOUNTING_ORG_NAME=MaSociete
ACCOUNTING_ORG_VAT=FRXX999999999
ACCOUNTING_ORG_ADDRESS=12 Rue Exemple, 75000 Paris

# OBJECTIFS TECHNIQUES
1) Pull/reset sur origin/main avant toute action.
2) Generer .env depuis .env.example en injectant les valeurs ci-dessus.
3) Lancer stack dev (dev_down.ps1 puis dev_up.ps1; fallback docker compose).
4) Seed de donnees: users, missions, assignments, echantillons compta.
5) Lancer les tests (scripts/test_all.ps1; fallback pytest).
6) Afficher etat des services et 200 lignes de logs API.
7) Ouvrir endpoints clefs (health, front, proxy).

# DOMAINE METIER: MISSIONS ET PLANNING
- Mission: { id, title, start, end, location, positions[], status, notes }
- Position: { label, count>=1, skills{}, rate_type(hourly|flat), rate_value }
- Assignment: { id, mission_id, user_id, role_label, status(draft|invited|confirmed|declined|done), pay_rate, hours }
- Planning: filtres par date_from/date_to, statut, role, texte; pagination.

# DOMAINE METIER: COMPTABILITE
- Invoice (Facture): { id, number, date, client_name, client_vat?, lines[], currency, vat_rate, totals{ht,tva,ttc}, status(draft|sent|paid|canceled), due_date, payments[] }
- InvoiceLine: { label, qty, unit_price, vat_rate?, account? }
- Expense (Depense): { id, date, supplier, label, amount_ht, vat_rate, amount_ttc, category, attachment? }
- Payment: { id, invoice_id, date, amount, method }
- Reports:
  - /accounting/reports/vat?from=YYYY-MM-DD&to=YYYY-MM-DD
  - /accounting/reports/pnl?from=...&to=...
  - /accounting/exports/invoices.csv, /expenses.csv
- Regles calcul:
  - totals_ht = sum(qty*unit_price)
  - tva = totals_ht * vat_rate
  - ttc = totals_ht + tva
  - balance_client = sum(invoices.ttc - payments.amount)
  - depenses_tva = sum(expense.amount_ht * expense.vat_rate)

# ENDPOINTS A FOURNIR (FastAPI)
Auth:
- POST /auth/register
- POST /auth/token-json
- GET  /auth/me

Health:
- GET /healthz -> { ok: true, version }

Missions:
- GET  /missions?q&status&date_from&date_to&role&page&per_page
- POST /missions
- GET  /missions/{id}
- PUT  /missions/{id}
- DELETE /missions/{id}
- POST /missions/{id}/assign -> cree ou met a jour une assignment

Assignments:
- GET  /assignments?mission_id&user_id&status
- PUT  /assignments/{id} -> mise a jour status/rate/hours
- DELETE /assignments/{id}

Planning:
- GET /planning/calendar?from&to -> missions+assignments calendrier
- GET /planning/ics?from&to -> export ICS

Accounting:
- GET  /accounting/invoices?status&client&q&page&per_page
- POST /accounting/invoices
- GET  /accounting/invoices/{id}
- PUT  /accounting/invoices/{id}
- POST /accounting/invoices/{id}/payments
- POST /accounting/invoices/{id}/send-test   # mock envoi
- GET  /accounting/expenses?q&category&from&to&page&per_page
- POST /accounting/expenses
- GET  /accounting/reports/vat?from&to
- GET  /accounting/reports/pnl?from&to
- GET  /accounting/exports/invoices.csv
- GET  /accounting/exports/expenses.csv

Admin:
- GET /admin/users
- GET /admin/users/{id}
- DELETE /admin/users/{id}
- POST /admin/reset
- GET /admin/notifications/diagnostic

# CRITERES DE QUALITE
- Validation Pydantic stricte: start < end, positions non vides, montants >= 0.
- Statuts coherents (ex: invoice paid -> total payments >= ttc).
- Tests unitaires couvrant: missions CRUD, assign, compta (TVA, totaux), exports CSV.
- Reponses JSON stables schemaes via schemas.py.
- Logs niveau INFO par defaut.

# COMMANDES POWERSHELL A PRODUIRE PAR L'AGENT
$ErrorActionPreference = "Stop"

# 0) Pull/Reset
cd C:\Users\SAM
if (Test-Path .\app_v1\.git) {
  cd .\app_v1
  git fetch --all
  git reset --hard origin/main
} else {
  git clone https://github.com/aubronsamuel-hash/App_2.0.0 app_v1
  cd .\app_v1
}

# 1) .env
Copy-Item -Force .env.example .env
(Get-Content .env) `
  -replace '^POSTGRES_DB=.*', 'POSTGRES_DB=appdb' `
  -replace '^POSTGRES_USER=.*', 'POSTGRES_USER=appuser' `
  -replace '^POSTGRES_PASSWORD=.*', 'POSTGRES_PASSWORD=appsecret' `
  -replace '^POSTGRES_HOST=.*', 'POSTGRES_HOST=postgres' `
  -replace '^POSTGRES_PORT=.*', 'POSTGRES_PORT=5432' `
  -replace '^ALLOWED_ORIGINS=.*', 'ALLOWED_ORIGINS=http://localhost:5173' `
  -replace '^TRUSTED_HOSTS=.*', 'TRUSTED_HOSTS=localhost,127.0.0.1' `
  -replace '^TOKEN_TTL_MIN=.*', 'TOKEN_TTL_MIN=4320' `
  -replace '^LOG_LEVEL=.*', 'LOG_LEVEL=INFO' `
  -replace '^ACCOUNTING_CURRENCY=.*', 'ACCOUNTING_CURRENCY=EUR' `
  -replace '^ACCOUNTING_VAT_RATE=.*', 'ACCOUNTING_VAT_RATE=0.20' `
  -replace '^ACCOUNTING_FISCAL_YEAR_START=.*', 'ACCOUNTING_FISCAL_YEAR_START=2025-01-01' `
  -replace '^ACCOUNTING_ORG_NAME=.*', 'ACCOUNTING_ORG_NAME=MaSociete' `
  -replace '^ACCOUNTING_ORG_VAT=.*', 'ACCOUNTING_ORG_VAT=FRXX999999999' `
  -replace '^ACCOUNTING_ORG_ADDRESS=.*', 'ACCOUNTING_ORG_ADDRESS=12 Rue Exemple, 75000 Paris' |
  Set-Content .env -Encoding ASCII

# 2) Stack dev
if (Test-Path .\scripts\dev_down.ps1) { powershell -ExecutionPolicy Bypass -File .\scripts\dev_down.ps1 } else { docker compose down -v }
if (Test-Path .\scripts\dev_up.ps1)   { powershell -ExecutionPolicy Bypass -File .\scripts\dev_up.ps1 }   else { docker compose build --no-cache; docker compose up -d }

# 3) Seed
if (Test-Path .\scripts\seed.ps1) { powershell -ExecutionPolicy Bypass -File .\scripts\seed.ps1 }

# 4) Tests
$ok = $false
if (Test-Path .\scripts\test_all.ps1) {
  try { powershell -ExecutionPolicy Bypass -File .\scripts\test_all.ps1; $ok = $true } catch {}
}
if (-not $ok) { try { docker compose exec api pytest -q; $ok = $true } catch {} }

# 5) Etat + logs + URLs
try { docker compose ps } catch { docker-compose ps }
try { docker compose logs api --tail=200 } catch { docker-compose logs api --tail=200 }
Write-Host "Open: http://localhost:8001/healthz"
Write-Host "Open: http://localhost:5173"
Write-Host "Open: http://localhost:8080"

# ACCEPTANCE
- Aucun warning POSTGRES_* not set.
- CRUD missions et assignments OK (tests verts).
- Comptabilite: totaux HT/TVA/TTC corrects, exports CSV dispo, rapports VAT et PnL OK.
- Endpoints up, logs propres, seed OK.

# STRATEGIE DE RECUPERATION
- Rebuild full: docker compose down -v ; docker compose build --no-cache ; docker compose up -d
- Si "docker compose" inconnu: utiliser "docker-compose".
- Ports occupes: netstat -ano | findstr :8001 ; Stop-Process -Id <PID> -Force

