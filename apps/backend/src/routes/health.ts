import type { FastifyPluginAsync } from "fastify";

const healthRoute: FastifyPluginAsync = async (app) => {
  app.get("/health", async (_request, reply) => {
    try {
      await app.verifyDatabaseConnection();
      return {
        status: "ok",
        service: "backend",
        database: {
          status: "ok"
        },
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      app.log.error({ err: error }, "Database health check failed.");
      reply.code(503);
      return {
        status: "degraded",
        service: "backend",
        database: {
          status: "unavailable",
          message: "Check DATABASE_URL and ensure PostgreSQL is running."
        },
        timestamp: new Date().toISOString()
      };
    }
  });
};

export default healthRoute;
