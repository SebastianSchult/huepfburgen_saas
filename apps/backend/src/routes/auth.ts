import type { FastifyPluginAsync } from "fastify";
import { z } from "zod";
import { HttpError } from "../utils/http-error.js";
import { env } from "../config/env.js";
import { verifyPassword } from "../utils/password.js";
import { createAuthTokenPayload } from "../utils/jwt.js";

const loginBodySchema = z.object({
  email: z.string().email(),
  password: z.string().min(8)
});

const authMeResponseSchema = z.object({
  user: z.object({
    id: z.string().uuid(),
    tenantId: z.string().uuid(),
    email: z.string().email(),
    role: z.enum(["owner", "admin", "staff", "viewer"])
  }),
  tenant: z.object({
    id: z.string().uuid(),
    name: z.string().min(1),
    slug: z.string().min(1),
    plan: z.enum(["basic", "pro", "business"]),
    status: z.enum(["active", "suspended", "cancelled"])
  })
});

const authRoutes: FastifyPluginAsync = async (app) => {
  app.post("/auth/login", async (request) => {
    const body = loginBodySchema.parse(request.body);
    const normalizedEmail = body.email.trim().toLowerCase();

    const user = await app.prisma.user.findUnique({
      where: {
        email: normalizedEmail
      },
      select: {
        id: true,
        tenantId: true,
        email: true,
        role: true,
        status: true,
        passwordHash: true,
        tenant: {
          select: {
            status: true
          }
        }
      }
    });

    if (!user || !(await verifyPassword(body.password, user.passwordHash))) {
      throw new HttpError(401, "INVALID_CREDENTIALS", "Invalid email or password");
    }

    if (user.status !== "active") {
      throw new HttpError(403, "USER_DISABLED", "User account is not active");
    }

    if (user.tenant.status !== "active") {
      throw new HttpError(403, "TENANT_INACTIVE", "Tenant account is not active");
    }

    const token = app.jwt.sign(
      createAuthTokenPayload({
        id: user.id,
        tenantId: user.tenantId,
        email: user.email,
        role: user.role
      }),
      {
        expiresIn: env.JWT_EXPIRES_IN
      }
    );

    return {
      accessToken: token,
      tokenType: "Bearer",
      expiresIn: env.JWT_EXPIRES_IN
    };
  });

  app.get("/auth/me", { preHandler: app.authenticate }, async (request) => {
    const context = app.requireRequestContext(request);

    return authMeResponseSchema.parse({
      user: context.user,
      tenant: context.tenant
    });
  });

  app.post("/auth/logout", { preHandler: app.authenticate }, async () => {
    return { success: true };
  });
};

export default authRoutes;
