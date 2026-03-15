import "fastify";
import type { AuthUser } from "@huepf/shared-types";
import type { PrismaClient } from "@prisma/client";

declare module "fastify" {
  interface FastifyRequest {
    authUser: AuthUser | null;
  }

  interface FastifyInstance {
    prisma: PrismaClient;
    authenticate: (request: FastifyRequest, reply: FastifyReply) => Promise<void>;
    verifyDatabaseConnection: () => Promise<void>;
  }
}
