# Prisma ORM Baseline

This repository uses **Prisma** as the standard ORM for the backend.

## Why Prisma

- Type-safe client generation for Node.js + TypeScript.
- Clear schema-first workflow for incremental database changes.
- Native PostgreSQL support for the SaaS data model.

## Core files

- `schema.prisma` - source of truth for database models and enums.

## Local commands

Run from repository root:

```bash
npm run prisma:validate -w @huepf/backend
npm run prisma:format -w @huepf/backend
npm run prisma:generate -w @huepf/backend
npm run prisma:migrate:dev -w @huepf/backend -- --name <migration_name>
npm run prisma:studio -w @huepf/backend
```

## Incremental schema workflow

1. Update `schema.prisma` with the next small domain change.
2. Validate and format schema (`prisma:validate`, `prisma:format`).
3. Generate a named migration (`prisma:migrate:dev -- --name ...`).
4. Regenerate Prisma Client (`prisma:generate`).
5. Run backend checks (`typecheck`, `lint`) before creating the PR.

## Rules

- Keep migrations small and ticket-focused.
- Prefer additive schema changes for MVP progression.
- Use descriptive migration names for easier review and rollback planning.
