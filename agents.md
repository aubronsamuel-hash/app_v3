REVERSE PROXY CADDY + SECURITY HEADERS

USER:
Add deploy/caddy/Caddyfile for local and prod:

Serve frontend static (optional) or proxy to front dev server.

Reverse-proxy /api to backend API :8001

TLS (placeholder for prod), HSTS, CSP minimal, X-Frame-Options, Referrer-Policy.

Basic auth gates for /_internal/* (Grafana, Prometheus, Dozzle).

Update compose.yaml:

caddy service on 8080, mount Caddyfile, depends_on api/front.

Checks:

curl http://localhost:8080/healthz via caddy -> 200

Security headers present on responses.

