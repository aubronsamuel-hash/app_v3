# Application Hardening Checklist

- **Content-Security-Policy (CSP)** and **Strict-Transport-Security (HSTS)** headers enabled.
- **CORS** restricted to trusted origins only.
- **Rate limits** enforced for write and login operations.
- **JWT/opaque tokens** rotated regularly.
- **Secrets** rotated on schedule and stored securely.
- **File uploads** limited to 5MB; optional **antivirus** scanning.
