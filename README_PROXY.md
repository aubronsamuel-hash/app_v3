Reverse proxy
==============

Caddy runs as an HTTP reverse proxy for local development. HTTPS is intentionally disabled to avoid certificate prompts on Windows.

Usage
-----

1. Start the stack:

   docker compose up -d

2. Format the Caddyfile inside the proxy container when updating it:

   docker compose exec proxy caddy fmt --overwrite /etc/caddy/Caddyfile

Health checks
-------------

Verify the proxy and upstreams:

```
curl http://localhost/_proxy/health
curl http://localhost/api/healthz
curl http://localhost/
```
