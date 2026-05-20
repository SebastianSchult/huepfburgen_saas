import fp from "fastify-plugin";
import fastifyJwt from "@fastify/jwt";
import { env } from "../config/env.js";
import { parseAuthTokenPayload } from "../utils/jwt.js";

const authPlugin = fp(async (app) => {
  await app.register(fastifyJwt, {
    secret: env.JWT_SECRET,
    sign: {
      iss: env.JWT_ISSUER,
      aud: env.JWT_AUDIENCE,
      expiresIn: env.JWT_EXPIRES_IN
    },
    verify: {
      allowedIss: env.JWT_ISSUER,
      allowedAud: env.JWT_AUDIENCE
    }
  });

  app.decorateRequest("authUser", null);

  app.decorate("authenticate", async (request, reply) => {
    try {
      const payload = await request.jwtVerify();
      request.authUser = parseAuthTokenPayload(payload);
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
