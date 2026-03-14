import fp from "fastify-plugin";
import fastifyJwt from "@fastify/jwt";
import type { AuthUser } from "@huepf/shared-types";
import { env } from "../config/env.js";

const authPlugin = fp(async (app) => {
  await app.register(fastifyJwt, {
    secret: env.JWT_SECRET
  });

  app.decorateRequest("authUser", null);

  app.decorate("authenticate", async (request, reply) => {
    try {
      await request.jwtVerify();
      const payload = request.user as AuthUser;
      request.authUser = payload;
    } catch {
      reply.code(401).send({
        error: {
          code: "UNAUTHORIZED",
          message: "Authentication required",
          details: []
        }
      });
    }
  });
});

export default authPlugin;
