import "fastify";
import type { AuthUser, TenantPlan, TenantStatus, UserRole } from "@huepf/shared-types";
import type { PrismaClient } from "@prisma/client";

declare module "fastify" {
  interface TenantRequestContext {
    user: AuthUser;
    tenant: {
      id: string;
      name: string;
      slug: string;
      plan: TenantPlan;
      status: TenantStatus;
    };
  }

  interface FastifyRequest {
    authUser: AuthUser | null;
    requestContext: TenantRequestContext | null;
  }

  interface FastifyInstance {
    prisma: PrismaClient;
    authenticate: (request: FastifyRequest, reply: FastifyReply) => Promise<void>;
    requireRequestContext: (request: FastifyRequest) => TenantRequestContext;
    authorizeRoles: (request: FastifyRequest, allowedRoles: readonly UserRole[]) => TenantRequestContext;
    authorizeMinimumRole: (request: FastifyRequest, minimumRole: UserRole) => TenantRequestContext;
    authorizeTenant: (request: FastifyRequest, tenantId: string) => TenantRequestContext;
    verifyDatabaseConnection: () => Promise<void>;
  }
}
