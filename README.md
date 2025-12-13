# BrickIdle

Small idle brick game with a Vite frontend and a NestJS API backed by Postgres. The API stores scores and player suggestions, surfaces recent GitHub commits, and exposes a simple healthcheck for uptime probes.

## Requirements
- Node 20+ and npm
- Docker (for local DB or full stack)

## Quick start (local)
1) Install deps: `npm ci`
2) Start Postgres (e.g. `docker compose up db`)
3) Set env vars (see below) and run the API: `npm run api:dev`
4) Start the frontend against that API: `npm run dev`

### Environment
- Backend:
  - `DATABASE_URL=postgres://user:pass@host:5432/db`
  - `API_KEYS=comma,separated,keys` (required for mutating routes)
  - `PGSSL_DISABLE=1` to disable SSL locally
  - `PORT` (optional, default 3000)
  - `GITHUB_OWNER` / `GITHUB_REPO` (default: AlexAgo83/blockidle)
  - `GITHUB_TOKEN` (optional, avoids GitHub rate limits)
  - `CORS_ORIGINS` or `ALLOWED_ORIGINS` to append allowed origins (defaults include `https://block-idle.onrender.com` and localhost)
- Frontend:
  - `VITE_API_BASE` (e.g. `http://localhost:3000`)
  - `VITE_API_TOKEN` or `VITE_API_KEY` (sent as `x-api-key` for protected routes)

### API endpoints
- `GET /health` – DB connectivity probe.
- `GET /scores?limit=10` – Top scores ordered by score then end time.
- `POST /scores` – Create/update a score (requires `x-api-key`). Body: `{ "player": "Name", "score": 123, "stage": 2, "level": 5, "endedAt": "2024-01-01T12:00:00Z", "build": "b20" }`.
- `GET /suggestions?limit=10` – Recent suggestions.
- `POST /suggestions` – Create a suggestion (requires `x-api-key`). Body: `{ "player": "Name", "category": "feature|bug", "message": "text" }`.
- `PATCH /suggestions/:id/status` – Update status to `open|done|rejected` (requires `x-api-key`).
- `DELETE /suggestions/:id` – Delete a suggestion (requires `x-api-key`).
- `GET /commits?limit=10` – Recent GitHub commits for the configured repo.

### Scripts
- `npm run dev` – Frontend dev server.
- `npm run api:dev` – Nest API in dev mode (ts-node).
- `npm run api:build` – Compile backend TypeScript.
- `npm run build` – Build frontend (and auto-install if needed).
- `npm test` – API tests with mocked DB.

### Docker
- `docker compose up --build` launches Postgres, API (port 3000), and nginx frontend (port 8080). Set `API_KEYS`/`DATABASE_URL`/CORS vars in your shell or a `.env` consumed by Docker Compose.

### Notes
- Mutating routes reject missing/invalid API keys.
- CORS allows the production frontend, the backend itself, and localhost by default; add more via env.
- Scores are unique per `(player, build)`; higher scores replace lower ones on the same build.
