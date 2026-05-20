# Huepfburgen SaaS

Multi-tenant rental SaaS starter.

## Stack

- Frontend: React + TypeScript + Vite + Tailwind
- Backend: Node.js + TypeScript + Fastify + Prisma + Zod
- Worker: Node.js + BullMQ + Redis
- Database: PostgreSQL
- Local infrastructure: Docker Compose

## Monorepo structure

- `apps/frontend` - tenant-facing web app
- `apps/backend` - API (`/api/v1`) with auth and tenant-aware foundation
- `apps/worker` - async job worker foundation
- `packages/shared-types` - shared contracts and enums
- `packages/eslint-config` - shared lint presets
- `packages/tsconfig` - shared TypeScript base config

## ORM standard

The backend ORM standard is **Prisma**.

- Schema source: `apps/backend/prisma/schema.prisma`
- Local ORM guide: `apps/backend/prisma/README.md`

## Quick start

1. Install dependencies:

```bash
npm install
```

2. Start infrastructure:

```bash
docker compose up -d postgres redis
```

Default local PostgreSQL credentials from `docker-compose.yml`:

- host: `localhost`
- port: `5432`
- database: `huepfburgen_saas`
- user: `postgres`
- password: `postgres`

3. Configure environment files:

- copy `.env.example` values into `apps/backend/.env`
- copy frontend values into `apps/frontend/.env`

4. Initialize Prisma:

```bash
npm run prisma:validate -w @huepf/backend
npm run prisma:format -w @huepf/backend
npm run prisma:generate -w @huepf/backend
npm run prisma:migrate:dev -w @huepf/backend
```

5. Verify backend database connectivity:

```bash
npm run db:check -w @huepf/backend
```

6. Start all services:

```bash
npm run dev
```

## Database troubleshooting

- If `db:check` fails, ensure PostgreSQL is running:

```bash
docker compose ps postgres
```

- Verify `apps/backend/.env` contains a valid `DATABASE_URL`:

```text
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/huepfburgen_saas
```

- Backend startup verifies the PostgreSQL connection and logs a clear error if the connection fails.
- `GET /api/v1/health` returns `503` with actionable database status when PostgreSQL is unavailable.

## Security baseline

- Tenant context is resolved from JWT, never trusted from payload.
- All business tables include `tenant_id`.
- Password hashing uses `scrypt` with per-password random salts.
- Do not commit `.env` files or secrets.

### Demo auth credentials (local placeholder flow)

- owner: `owner@demo-huepfburgen.local` / `owner-demo-password`
- staff: `staff@demo-huepfburgen.local` / `staff-demo-password`

## Deployment (GitHub Actions)

- Workflow: `.github/workflows/deploy-on-main-merge.yml`
- Trigger: merged pull requests into `main`
- Production services are defined in `docker-compose.prod.yml`:
  - `backend` (Fastify API)
  - `postgres`
  - `redis`
  - `caddy` (automatic HTTPS reverse proxy)

Server-side production environment template:

- `.env.production.example` (copy to `.env.production` on the server and fill values)

Deploy sequence executed on the server:

```bash
git pull --ff-only origin main
docker compose --env-file .env.production -f docker-compose.prod.yml pull postgres redis caddy
docker compose --env-file .env.production -f docker-compose.prod.yml build backend
docker compose --env-file .env.production -f docker-compose.prod.yml up -d postgres redis
docker compose --env-file .env.production -f docker-compose.prod.yml run --rm backend npx prisma db push --schema prisma/schema.prisma
docker compose --env-file .env.production -f docker-compose.prod.yml up -d backend caddy
```

### Required repository secrets

- `DEPLOY_SSH_HOST`: server hostname or IP
- `DEPLOY_SSH_USER`: SSH user
- `DEPLOY_SSH_PORT`: SSH port (for example `22`)
- `DEPLOY_SSH_PRIVATE_KEY`: private SSH key used by GitHub Actions
- `DEPLOY_TARGET_DIR`: absolute directory on server where the repository is cloned

### Workflow behavior

- Runs `npm ci`, `npm run typecheck`, `npm run lint`, and `npm run build` before deployment.
- Aborts deployment if any required secret is missing.
- Aborts if `.env.production` is missing on the server.
- Connects via SSH and runs the Docker Compose deployment sequence in `DEPLOY_TARGET_DIR`.

## Frontend Deployment (GitHub Actions + FTPS)

- Workflow: `.github/workflows/deploy-frontend-on-main-merge.yml`
- Trigger: merged pull requests into `main`
- Build environment:
  - `VITE_API_BASE_URL=https://api.46.225.213.51.sslip.io/api/v1`

### Required repository secrets

- `FRONTEND_FTP_SERVER`: FTP host (for example `w01f67fb.kasserver.com`)
- `FRONTEND_FTP_USERNAME`: FTP username
- `FRONTEND_FTP_PASSWORD`: FTP password

Current deployment target path in workflow:

- `/sebastian-schult.net/`

### Workflow behavior

- Runs `npm ci`.
- Builds frontend with the production API base URL.
- Deploys `apps/frontend/dist/` via FTPS to the configured server directory.

## Next implementation slices

1. Auth login + `/api/v1/auth/me`
2. Equipment module CRUD
3. Customer module CRUD
4. Booking + availability + conflict checks
5. Platform admin support sessions with audit logs
