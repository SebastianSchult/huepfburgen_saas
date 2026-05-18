FROM node:22-bookworm-slim

WORKDIR /app

COPY package.json package-lock.json ./
COPY apps/backend/package.json apps/backend/package.json
COPY packages/shared-types/package.json packages/shared-types/package.json
COPY packages/tsconfig/package.json packages/tsconfig/package.json
COPY packages/eslint-config/package.json packages/eslint-config/package.json

RUN npm ci

COPY packages/shared-types packages/shared-types
COPY packages/tsconfig packages/tsconfig
COPY apps/backend apps/backend

RUN npm run build -w @huepf/shared-types \
  && npm run build -w @huepf/backend \
  && npm run prisma:generate -w @huepf/backend

WORKDIR /app/apps/backend

EXPOSE 3001

CMD ["node", "dist/server.js"]
