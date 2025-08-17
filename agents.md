SEED + FIXTURES + DEMO DATA

USER:
Implement backend/scripts/seed_plus.py (async):

Options: --reset, --users N, --missions N, --days D, --all

Create admin user (admin/admin), N users with roles/skills, missions over D days with positions, sample assignments.

Output stats and admin credentials.

Integrate in scripts/seed.ps1.

Acceptance:

scripts/seed.ps1 -> admin login works, GET /missions returns data.

