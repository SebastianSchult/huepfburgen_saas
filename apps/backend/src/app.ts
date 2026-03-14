import Fastify from "fastify";
import fastifyCors from "@fastify/cors";
import { ZodError } from "zod";
import apiRoutes from "./routes/index.js";
import authPlugin from "./plugins/auth.js";
import { env } from "./config/env.js";
import { HttpError } from "./utils/http-error.js";

export const buildApp = () => {
  const app = Fastify({
    logger: {
      level: env.NODE_ENV === "development" ? "debug" : "info"
    }
  });

  app.register(fastifyCors, {
    origin: env.CORS_ORIGIN,
    credentials: true
  });

  app.register(authPlugin);
  app.register(apiRoutes, { prefix: "/api/v1" });

  app.setErrorHandler((error, _request, reply) => {
    if (error instanceof ZodError) {
      reply.code(400).send({
        error: {
          code: "VALIDATION_ERROR",
          message: "Request validation failed",
          details: error.issues
        }
      });
      return;
    }

    if (error instanceof HttpError) {
      reply.code(error.statusCode).send({
        error: {
          code: error.code,
          message: error.message,
          details: error.details
        }
      });
      return;
    }

    app.log.error(error);
    reply.code(500).send({
      error: {
        code: "INTERNAL_SERVER_ERROR",
        message: "An unexpected error occurred",
        details: []
      }
    });
  });

  return app;
};
