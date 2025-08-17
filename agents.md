FRONTEND REACT TS + TYPED API CLIENT

USER:
In frontend/, scaffold React + TS + Vite app with Tailwind and minimal UI primitives (Button/Card/Badge).

Provide:

package.json scripts: dev, build, preview, lint, typecheck.

src/lib/api.ts: typed HTTP client (base from VITE_API_BASE, bearer token support, error typing).

src/lib/hooks.ts: useAuth(), useMissions(), usePlanning(), useAdminUsers() using react-query.

Pages: Login, Dashboard, Missions (list + detail + actions publish/duplicate), Planning (week), Admin Users, Settings.

Replace mocks by hooks calling backend endpoints (document mapping).

.env.example with VITE_API_BASE=http://127.0.0.1:8001

Checks:

npm run build succeeds.

Show a short demo code that fetches GET /auth/me with stored token.

