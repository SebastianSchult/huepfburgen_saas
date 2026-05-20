import "fastify";
import type { AuthUser, TenantPlan, TenantStatus } from "@huepf/shared-types";
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
    verifyDatabaseConnection: () => Promise<void>;
  }
}
