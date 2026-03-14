import { env } from "./config/env.js";
import { buildApp } from "./app.js";

const start = async () => {
  const app = buildApp();

  try {
    await app.listen({
      host: env.HOST,
      port: env.PORT
    });
    app.log.info(`Backend listening on http://${env.HOST}:${env.PORT}`);
  } catch (error) {
    app.log.error(error);
    process.exit(1);
  }
};

void start();
