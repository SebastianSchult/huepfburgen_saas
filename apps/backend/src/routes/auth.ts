import type { FastifyPluginAsync } from "fastify";
import { z } from "zod";
import { HttpError } from "../utils/http-error.js";
import { USER_ROLES } from "@huepf/shared-types";
import { hashPassword, verifyPassword } from "../utils/password.js";

const loginBodySchema = z.object({
  email: z.string().email(),
  password: z.string().min(8)
});

const demoUsers = [
  {
    id: "demo-owner-id",
    tenantId: "demo-tenant-id",
    email: "owner@demo-huepfburgen.local",
    role: USER_ROLES[0],
    password: "owner-demo-password"
  },
  {
    id: "demo-staff-id",
    tenantId: "demo-tenant-id",
    email: "staff@demo-huepfburgen.local",
    role: USER_ROLES[2],
    password: "staff-demo-password"
  }
] as const;

const authRoutes: FastifyPluginAsync = async (app) => {
  const demoUsersWithHashes = await Promise.all(
    demoUsers.map(async (user) => ({
      ...user,
      passwordHash: await hashPassword(user.password)
    }))
  );

  app.post("/auth/login", async (request) => {
    const body = loginBodySchema.parse(request.body);
    const normalizedEmail = body.email.toLowerCase();

    const user = demoUsersWithHashes.find(
      (candidate) => candidate.email === normalizedEmail
    );

    if (!user || !(await verifyPassword(body.password, user.passwordHash))) {
      throw new HttpError(401, "INVALID_CREDENTIALS", "Invalid email or password");
    }

    // Placeholder auth flow: replace demo users with DB-backed user lookup.
    // Password validation already uses the shared hash strategy.

    const token = app.jwt.sign({
      id: user.id,
      tenantId: user.tenantId,
      email: user.email,
      role: user.role
    });

    return {
      accessToken: token,
      tokenType: "Bearer",
      expiresIn: "1h"
    };
  });

  app.get("/auth/me", { preHandler: app.authenticate }, async (request) => {
    if (!request.authUser) {
      throw new HttpError(401, "UNAUTHORIZED", "Authentication required");
    }

    return {
      user: request.authUser
    };
  });

  app.post("/auth/logout", { preHandler: app.authenticate }, async () => {
    return { success: true };
  });
};

export default authRoutes;
