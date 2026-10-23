# BrickIdle

**[▶ Play the demo](https://block-idle.onrender.com)** (hosted on Render's free tier: the first load can take ~30 s while it wakes up)

A breakout game with roguelite builds. Break bricks before they reach the bottom, level up, and shape each run:

- **Pilots**: each one starts the run with a free power or talent.
- **Powers and talents**: every level offers an upgrade; up to 4 of each.
- **Fusions**: some pairs at level 3 merge into a stronger power (Fire + Light → Sun).
- **Auto-aim**: aim and launch yourself, or let the game fire for you.
- **Leaderboard and suggestions**: scores and feature/bug ideas are saved online.
- Available in English, French and Spanish.

Built with a Vite frontend and a NestJS API on Postgres (Prisma).

## Requirements
- Node 20+ and npm
- Docker (for local DB or full stack)

## Quick start (local)
1) Install deps: `npm ci`
2) Start Postgres (e.g. `docker compose up db`)
3) Set env vars (see below), push the schema, then seed (optional): `npm run db:push && npm run db:seed`
4) Run the API: `npm run api:dev`
5) Start the frontend against that API: `npm run dev`

### Database (dedicated schema)
- `DATABASE_URL` must include `?schema=<name>` (e.g. `postgres://user:pass@host:5432/brickidle?schema=brickidle`). Avoid `schema=public`, especially in production.
- Commands: `npm run db:schema:ensure` (creates the schema), `npm run db:push` (ensures the schema, then Prisma db push), `npm run db:seed` (runs `prisma/seed.ts`, needs `DATABASE_SEED_PWD`), `npm run db:reset:schema` (drops and recreates the schema, then push and seed; refuses on prod/public unless `SCHEMA_RESET_FORCE=1`).
- The backend refuses to start if `DATABASE_URL` has no schema or the schema's tables are missing (run `npm run db:push`).

### Environment
- Backend:
  - `DATABASE_URL=postgres://user:pass@host:5432/db?schema=brickidle`
  - `API_KEYS=comma,separated,keys` (required for mutating routes)
  - `PGSSL_DISABLE=1` to disable SSL locally
  - `DATABASE_SEED_PWD` required to run `npm run db:seed`
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
