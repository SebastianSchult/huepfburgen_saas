export const USER_ROLES = ["owner", "admin", "staff", "viewer"] as const;
export type UserRole = (typeof USER_ROLES)[number];

export const TENANT_PLANS = ["basic", "pro", "business"] as const;
export type TenantPlan = (typeof TENANT_PLANS)[number];

export const TENANT_STATUSES = ["active", "suspended", "cancelled"] as const;
export type TenantStatus = (typeof TENANT_STATUSES)[number];

export interface AuthUser {
  id: string;
  tenantId: string;
  email: string;
  role: UserRole;
}
