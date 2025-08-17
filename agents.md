USER:
Add tests:

backend/tests: unit + API (auth, missions, assignments, rate limit).

frontend: Playwright e2e basic (login, navigate Missions, call publish).

perf/k6: smoke.js (sanity low VUs), load.js (ramp to 1000 VUs placeholders), output HTML to perf/reports/.

Scripts:

scripts/test_all.ps1 runs: pytest -q, npm ci && npm run build, npx playwright test, k6 run perf/smoke.js

Acceptance:

test_all.ps1 ends with OK summary and creates perf/reports/index.html
