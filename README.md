# Huepfburgen SaaS

Multi-tenant rental SaaS starter based on the architecture docs in `architecture/docs/`.

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
- `architecture/docs` - source architecture and planning documents

## Quick start

1. Install dependencies:

```bash
npm install
```

2. Start infrastructure:

```bash
docker compose up -d
```

3. Configure environment files:

- copy `.env.example` values into `apps/backend/.env`
- copy frontend values into `apps/frontend/.env`

4. Initialize Prisma:

```bash
npm run prisma:generate -w @huepf/backend
npm run prisma:migrate:dev -w @huepf/backend
```

5. Start all services:

```bash
npm run dev
```

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
