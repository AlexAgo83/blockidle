## BrickIdle Stack Quickstart

Prereqs:
- Node 20+, npm
- Docker Desktop (with `docker compose` v2)

Install:
- `npm ci`

Frontend:
- Build: `npm run build:app`

Backend (Nest):
- Dev: `npm run api:dev`
- Typecheck/build: `npm run api:build`

Env vars for API:
- `DATABASE_URL=postgres://user:pass@host:5432/db`
- `API_KEYS=your_api_key`
- `PGSSL_DISABLE=1` (disable SSL when local)
- `GITHUB_OWNER` / `GITHUB_REPO` (optional)

Docker (prod-like):
- `docker compose up --build`
- Ports: frontend `8080`, API `3000`, Postgres `5432`

Notes:
- Frontend is served by nginx in the frontend image.
- API serves only backend routes; static files come from the frontend container.
