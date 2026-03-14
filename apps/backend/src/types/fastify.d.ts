import "fastify";
import type { AuthUser } from "@huepf/shared-types";

declare module "fastify" {
  interface FastifyRequest {
    authUser: AuthUser | null;
  }

  interface FastifyInstance {
    authenticate: (request: FastifyRequest, reply: FastifyReply) => Promise<void>;
  }
}
