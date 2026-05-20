import fp from "fastify-plugin";
import fastifyJwt from "@fastify/jwt";
import { env } from "../config/env.js";
import { parseAuthTokenPayload } from "../utils/jwt.js";
import { HttpError } from "../utils/http-error.js";
import { assertAnyRole, assertMinimumRole } from "../utils/authorization.js";

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

  app.decorate("authenticate", async (request, _reply) => {
    let tokenPayload;

    try {
      tokenPayload = parseAuthTokenPayload(await request.jwtVerify());
    } catch {
      throw new HttpError(401, "UNAUTHORIZED", "Authentication required");
    }

    const user = await app.prisma.user.findUnique({
      where: {
        tenantId_id: {
          tenantId: tokenPayload.tenantId,
          id: tokenPayload.id
        }
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

    if (!user) {
      throw new HttpError(401, "UNAUTHORIZED", "Authentication required");
    }

    if (user.status !== "active") {
      throw new HttpError(403, "USER_DISABLED", "User account is not active");
    }

    if (user.tenant.status !== "active") {
      throw new HttpError(403, "TENANT_INACTIVE", "Tenant account is not active");
    }

    const authUser = {
      id: user.id,
      tenantId: user.tenantId,
      email: user.email,
      role: user.role
    };

    request.authUser = authUser;
    request.requestContext = {
      user: authUser,
      tenant: user.tenant
    };
  });

  app.decorate("requireRequestContext", (request) => {
    if (!request.requestContext) {
      throw new HttpError(401, "UNAUTHORIZED", "Authentication required");
    }

    return request.requestContext;
  });

  app.decorate("authorizeRoles", (request, allowedRoles) => {
    const context = app.requireRequestContext(request);
    assertAnyRole(context.user.role, allowedRoles);
    return context;
  });

  app.decorate("authorizeMinimumRole", (request, minimumRole) => {
    const context = app.requireRequestContext(request);
    assertMinimumRole(context.user.role, minimumRole);
    return context;
  });
});

export default authPlugin;
