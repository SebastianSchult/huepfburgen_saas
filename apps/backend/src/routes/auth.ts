import type { FastifyPluginAsync } from "fastify";
import { z } from "zod";
import { HttpError } from "../utils/http-error.js";
import { USER_ROLES } from "@huepf/shared-types";

const loginBodySchema = z.object({
  email: z.string().email(),
  password: z.string().min(8)
});

const authRoutes: FastifyPluginAsync = async (app) => {
  app.post("/auth/login", async (request) => {
    const body = loginBodySchema.parse(request.body);

    // Placeholder auth flow: replace with DB-backed user lookup and password hash compare.
    const role = body.email.includes("owner") ? USER_ROLES[0] : USER_ROLES[2];

    const token = app.jwt.sign({
      id: "demo-user-id",
      tenantId: "demo-tenant-id",
      email: body.email,
      role
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
