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
- Do not commit `.env` files or secrets.

## Next implementation slices

1. Auth login + `/api/v1/auth/me`
2. Equipment module CRUD
3. Customer module CRUD
4. Booking + availability + conflict checks
5. Platform admin support sessions with audit logs
