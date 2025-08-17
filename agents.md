OBSERVABILITY (PROMETHEUS, GRAFANA, LOKI)

USER:
Wire minimal observability:

deploy/prometheus/prometheus.yml scraping: api:/metrics, cadvisor, node exporters if any.

deploy/grafana/provisioning: dashboards for FastAPI (req rate, latency p50/p95/p99), Postgres (if exporter added), Docker cAdvisor.

deploy/loki+promtail: collect api and caddy logs.

compose.yaml profile "obs" to enable grafana, prometheus, loki, promtail, cadvisor.

Docs:

README: how to open Grafana at http://localhost:3000 (dev), default creds, dashboards ids.

Checks:

docker compose --profile obs up -d -> Grafana OK, Prometheus targets up
