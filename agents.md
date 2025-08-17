SECURITY CHECKLISTS AND HARDENING

USER:
Add docs in deploy/security/:

hardening_checklist.md (CSP/HSTS, CORS strict, rate limits, token rotation, secret rotation, file uploads limits 5MB, antivirus optional).

backups_restore.md (pg_dump/pg_restore, S3 lifecycle).

incident_runbook.md (rollbacks, feature flags, rate limit increase).

Provide PowerShell: scripts/security_probe.ps1 to curl critical endpoints and validate headers.

Acceptance:

security_probe.ps1 shows OK for headers and 413 on large upload.
