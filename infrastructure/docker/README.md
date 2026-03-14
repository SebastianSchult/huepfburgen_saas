# Docker Infrastructure

Primary local setup is defined in the repository root `docker-compose.yml`.

Services:

- PostgreSQL 16 (`localhost:5432`)
- Redis 7 (`localhost:6379`)

Usage:

```bash
docker compose up -d
docker compose down
```
