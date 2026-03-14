# Working Foundation

This file consolidates the architecture constraints from `architecture/docs/*.md` into a single implementation checklist.

## Product scope (MVP)

- Equipment management
- Customer CRM
- Booking management with booking items
- Availability and conflict detection
- Basic pricing calculation in backend
- Dashboard summary endpoint

## Core architecture decisions

- Multi-tenant SaaS from day 1 (shared DB + strict `tenant_id` isolation).
- Tenant context is resolved from JWT/session, never trusted from request payload.
- API-first backend with modular services (`/api/v1`).
- PostgreSQL as system of record.
- Worker/queue foundation prepared early (BullMQ + Redis).
- n8n used for integrations, not core domain logic.

## Security and platform operations

- Tenant users and platform admins are separate concerns.
- Support access should use time-boxed support sessions (impersonation), not hidden permanent admin access.
- All support sessions require a `reason` and are audit logged.

## Internationalization rules

- Internal domain values remain in English.
- UI supports at least German and English.
- Tenant settings should include locale, timezone, and currency.

## Database baseline

MVP schema includes:

- tenants
- users
- locations
- equipment_categories
- equipment
- customers
- bookings
- booking_items
- equipment_unavailability

Prepared extension tables:

- platform_admins
- support_sessions
- audit_logs

## Execution order

1. Foundation: monorepo, tooling, Docker, health endpoint.
2. Database + auth + tenant middleware.
3. Equipment + customers.
4. Bookings + availability + pricing.
5. Frontend MVP integration.
6. Platform support sessions.
7. Async jobs and external automations.

## Coding and workflow rules

- Ticket-driven development (GitHub issues).
- Documentation and code comments in English.
- Explanations for collaboration can be in German.
- Keep modules testable and tenant-safe by default.
