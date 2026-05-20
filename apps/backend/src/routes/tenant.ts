import type { FastifyPluginAsync } from "fastify";
import { Prisma } from "@prisma/client";
import { z } from "zod";
import { HttpError } from "../utils/http-error.js";

const tenantResponseSchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(1),
  slug: z.string().min(1),
  plan: z.enum(["basic", "pro", "business"]),
  status: z.enum(["active", "suspended", "cancelled"])
});

const updateTenantBodySchema = z
  .object({
    name: z.string().trim().min(1).max(120).optional(),
    slug: z
      .string()
      .trim()
      .min(3)
      .max(80)
      .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/)
      .optional()
  })
  .refine((value) => value.name !== undefined || value.slug !== undefined, {
    message: "At least one tenant field must be provided"
  });

const tenantWriteRoles = ["owner", "admin"] as const;

const tenantRoutes: FastifyPluginAsync = async (app) => {
  app.get("/tenant", { preHandler: app.authenticate }, async (request) => {
    const context = app.requireRequestContext(request);
    app.authorizeTenant(request, context.tenant.id);

    return tenantResponseSchema.parse(context.tenant);
  });

  app.patch("/tenant", { preHandler: app.authenticate }, async (request) => {
    const context = app.authorizeRoles(request, tenantWriteRoles);
    app.authorizeTenant(request, context.tenant.id);

    const body = updateTenantBodySchema.parse(request.body);

    try {
      const tenant = await app.prisma.tenant.update({
        where: {
          id: context.tenant.id
        },
        data: {
          ...(body.name !== undefined ? { name: body.name } : {}),
          ...(body.slug !== undefined ? { slug: body.slug } : {})
        },
        select: {
          id: true,
          name: true,
          slug: true,
          plan: true,
          status: true
        }
      });

      return tenantResponseSchema.parse(tenant);
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") {
        throw new HttpError(409, "TENANT_SLUG_ALREADY_EXISTS", "Tenant slug already exists");
      }

      throw error;
    }
  });
};

export default tenantRoutes;
