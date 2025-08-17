CI/CD GITHUB ACTIONS + SSH DEPLOYMENT

USER:
Create .github/workflows:

ci.yml: matrix (backend/front) -> lint, test, build; cache pip/npm; upload artifacts.

cd.yml: on tag: build Docker images (backend, frontend) with tags API_TAG/FRONT_TAG; push to registry; SSH to server; run deploy_prod.ps1-equivalent steps (compose pull + up -d); on failure, run rollback.ps1.

Provide:

scripts/deploy_prod.ps1: login registry, docker compose -f compose.prod.yaml pull && up -d

scripts/rollback.ps1: docker compose -f compose.prod.yaml down && docker compose -f compose.prod.yaml up -d 

Checks:

Print sample run logs and required secrets list (SSH_HOST, SSH_USER, SSH_KEY, REGISTRY_*, ENV_FILE_PATH).

