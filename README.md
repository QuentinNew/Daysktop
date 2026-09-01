# Daysktop

Self-hosted app to import and browse your journal data (Dailyo export).

## Stack
- Frontend: Angular + Angular Material (`apps/frontend`)
- Backend: NestJS + Prisma (`apps/backend`)
- DB: PostgreSQL (via `docker-compose.yml`)

## Running in dev

Requires Docker Desktop running, Node.js and npm installed.

**1. Start Postgres** (from the repo root)

```bash
docker compose up -d
```

**2. Start the backend** (NestJS, http://localhost:3000)

```bash
cd apps/backend
npm install               # first time only / after a dependency change
npx prisma migrate dev    # applies Prisma migrations to the DB
npm run start:dev
```

**3. Start the frontend** (Angular, http://localhost:4200) — in another terminal

```bash
cd apps/frontend
npm install    # first time only / after a dependency change
npm run start  # equivalent to `ng serve`
```

## Stopping

- Backend / frontend: `Ctrl+C` in their respective terminal.
- Postgres: `docker compose down` (data stays in the `postgres_data` Docker volume, it is not lost).

## Notes

- Postgres listens on `localhost:5432`, credentials in `docker-compose.yml` (`daysktop` / `daysktop`), used by `apps/backend/.env` (`DATABASE_URL`).
- Do NOT run `npm install prisma@latest` on this project: Prisma's `latest` npm tag currently points to an 8.x release candidate with a completely different CLI (no more classic `prisma migrate dev`). Stick to an explicit 6.x version (currently `6.19.3`).
