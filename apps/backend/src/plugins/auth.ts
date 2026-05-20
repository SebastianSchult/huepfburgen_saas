import fp from "fastify-plugin";
import fastifyJwt from "@fastify/jwt";
import type { FastifyReply } from "fastify";
import { env } from "../config/env.js";
import { parseAuthTokenPayload } from "../utils/jwt.js";
import { HttpError } from "../utils/http-error.js";

const sendAuthError = (
  reply: FastifyReply,
  statusCode: number,
  code: string,
  message: string
) => {
  reply.code(statusCode).send({
    error: {
      code,
      message,
      details: []
    }
  });
};

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
  app.decorateRequest("requestContext", null);

  app.decorate("authenticate", async (request, reply) => {
    let tokenUser;

    try {
      const payload = await request.jwtVerify();
      tokenUser = parseAuthTokenPayload(payload);
    } catch {
      sendAuthError(reply, 401, "UNAUTHORIZED", "Authentication required");
      return;
    }

    const dbUser = await app.prisma.user.findUnique({
      where: {
        id: tokenUser.id
      },
      select: {
        id: true,
        tenantId: true,
        email: true,
        role: true,
        status: true,
        tenant: {
          select: {
            id: true,
            name: true,
            slug: true,
            plan: true,
            status: true
          }
        }
      }
    });

    if (!dbUser || dbUser.tenantId !== tokenUser.tenantId) {
      sendAuthError(reply, 401, "UNAUTHORIZED", "Authentication required");
      return;
    }

    if (dbUser.status !== "active") {
      sendAuthError(reply, 403, "USER_DISABLED", "User account is not active");
      return;
    }

    if (dbUser.tenant.status !== "active") {
      sendAuthError(reply, 403, "TENANT_INACTIVE", "Tenant account is not active");
      return;
    }

    const authUser = {
      id: dbUser.id,
      tenantId: dbUser.tenantId,
      email: dbUser.email,
      role: dbUser.role
    };

    request.authUser = authUser;
    request.requestContext = {
      user: authUser,
      tenant: dbUser.tenant
    };
  });

  app.decorate("requireRequestContext", (request) => {
    if (!request.requestContext) {
      throw new HttpError(401, "UNAUTHORIZED", "Authentication required");
    }

    return request.requestContext;
  });
});

export default authPlugin;
