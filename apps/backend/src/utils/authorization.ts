import type { UserRole } from "@huepf/shared-types";
import { HttpError } from "./http-error.js";

const ROLE_PRIORITY: Record<UserRole, number> = {
  viewer: 10,
  staff: 20,
  admin: 30,
  owner: 40
};

const ensureNonEmptyRoles = (allowedRoles: readonly UserRole[]) => {
  if (allowedRoles.length > 0) {
    return;
  }

  throw new HttpError(
    500,
    "AUTHORIZATION_CONFIG_ERROR",
    "Authorization helper received no allowed roles"
  );
};

export const hasAnyRole = (role: UserRole, allowedRoles: readonly UserRole[]): boolean => {
  ensureNonEmptyRoles(allowedRoles);
  return allowedRoles.includes(role);
};

export const hasMinimumRole = (role: UserRole, minimumRole: UserRole): boolean =>
  ROLE_PRIORITY[role] >= ROLE_PRIORITY[minimumRole];

export const assertAnyRole = (role: UserRole, allowedRoles: readonly UserRole[]): void => {
  if (hasAnyRole(role, allowedRoles)) {
    return;
  }

  throw new HttpError(403, "FORBIDDEN", "Insufficient permissions");
};

export const assertMinimumRole = (role: UserRole, minimumRole: UserRole): void => {
  if (hasMinimumRole(role, minimumRole)) {
    return;
  }

  throw new HttpError(403, "FORBIDDEN", "Insufficient permissions");
};
