#!/usr/bin/env bash
set -euo pipefail

CONF="${CONF:-deploy/caddy/Caddyfile}"

case "${1:-}" in
  fmt)
    caddy fmt --overwrite "$CONF"
    ;;
  validate)
    caddy validate --config "$CONF"
    ;;
  reload)
    caddy reload --config "$CONF"
    ;;
  logs)
    caddy list-modules >/dev/null 2>&1 || true
    ;;
  smoke)
    curl -i http://localhost:8080/ || true
    curl -i http://localhost:8080/auth/me || true
    ;;
  *)
    echo "Usage: $0 {fmt|validate|reload|logs|smoke}"
    exit 1
    ;;
esac
