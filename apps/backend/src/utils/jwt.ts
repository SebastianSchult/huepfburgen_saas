import { USER_ROLES, type AuthUser } from "@huepf/shared-types";
import { z } from "zod";

const authTokenPayloadSchema = z.object({
  sub: z.string().uuid(),
  tenantId: z.string().uuid(),
  email: z.string().email(),
  role: z.enum(USER_ROLES)
});

export type AuthTokenPayload = z.infer<typeof authTokenPayloadSchema>;

export const createAuthTokenPayload = (user: AuthUser): AuthTokenPayload => ({
  sub: user.id,
  tenantId: user.tenantId,
  email: user.email,
  role: user.role
});

export const parseAuthTokenPayload = (payload: unknown): AuthUser => {
  const parsed = authTokenPayloadSchema.parse(payload);

  return {
    id: parsed.sub,
    tenantId: parsed.tenantId,
    email: parsed.email,
    role: parsed.role
  };
};
