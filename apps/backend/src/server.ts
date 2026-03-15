import { env } from "./config/env.js";
import { buildApp } from "./app.js";

const maskDatabaseUrl = (url: string): string => {
  try {
    const parsed = new URL(url);
    if (parsed.password) {
      parsed.password = "***";
    }
    return parsed.toString();
  } catch {
    return "<invalid_database_url>";
  }
};

const start = async () => {
  const app = buildApp();

  try {
    await app.ready();

    await app.verifyDatabaseConnection();
    app.log.info(
      { databaseUrl: maskDatabaseUrl(env.DATABASE_URL) },
      "PostgreSQL connection verified."
    );

    await app.listen({
      host: env.HOST,
      port: env.PORT
    });
    app.log.info(`Backend listening on http://${env.HOST}:${env.PORT}`);
  } catch (error) {
    app.log.error(
      {
        err: error,
        databaseUrl: maskDatabaseUrl(env.DATABASE_URL)
      },
      "Backend startup failed. Check DATABASE_URL and ensure PostgreSQL is running (`docker compose up -d postgres`)."
    );
    process.exit(1);
  }
};

void start();
