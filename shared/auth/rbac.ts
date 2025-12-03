import type { UserRole, Permission } from "./types"

export const ROLE_PERMISSIONS: Record<UserRole, Permission[]> = {
  bank_admin: [{ resource: "*", actions: ["create", "read", "update", "delete"] }],
  compliance_officer: [
    { resource: "transactions", actions: ["read"] },
    { resource: "compliance", actions: ["create", "read", "update"] },
    { resource: "audit_logs", actions: ["read"] },
    { resource: "alerts", actions: ["create", "read", "update"] },
    { resource: "users", actions: ["read"] },
  ],
  operations: [
    { resource: "transactions", actions: ["read", "update"] },
    { resource: "settlements", actions: ["read", "update"] },
    { resource: "wallets", actions: ["read"] },
    { resource: "agents", actions: ["read", "update"] },
  ],
  business: [
    { resource: "wallets", actions: ["read"] },
    { resource: "transactions", actions: ["create", "read"] },
    { resource: "settlements", actions: ["read"] },
  ],
  individual: [
    { resource: "wallets", actions: ["read"] },
    { resource: "transactions", actions: ["create", "read"] },
  ],
  agent: [
    { resource: "settlements", actions: ["read", "update"] },
    { resource: "transactions", actions: ["create", "read"] },
    { resource: "agents", actions: ["read"] },
  ],
}

export class RBACService {
  /**
   * Check if user has permission for a resource and action
   */
  static hasPermission(role: UserRole, resource: string, action: "create" | "read" | "update" | "delete"): boolean {
    const permissions = ROLE_PERMISSIONS[role]

    // Check for wildcard permission
    const wildcardPerm = permissions.find((p) => p.resource === "*")
    if (wildcardPerm && wildcardPerm.actions.includes(action)) {
      return true
    }

    // Check for specific resource permission
    const resourcePerm = permissions.find((p) => p.resource === resource)
    if (resourcePerm && resourcePerm.actions.includes(action)) {
      return true
    }

    return false
  }

  /**
   * Get all resources a user can access
   */
  static getAccessibleResources(role: UserRole): string[] {
    const permissions = ROLE_PERMISSIONS[role]

    // If has wildcard, return all resources
    if (permissions.some((p) => p.resource === "*")) {
      return ["*"]
    }

    return permissions.map((p) => p.resource)
  }

  /**
   * Check if role can approve transactions
   */
  static canApproveTransactions(role: UserRole): boolean {
    return ["bank_admin", "compliance_officer", "operations"].includes(role)
  }

  /**
   * Check if role can access admin dashboard
   */
  static canAccessAdminDashboard(role: UserRole): boolean {
    return ["bank_admin", "compliance_officer", "operations"].includes(role)
  }

  /**
   * Get approval tier for role
   */
  static getApprovalTier(role: UserRole): number {
    const tiers: Record<UserRole, number> = {
      bank_admin: 3,
      compliance_officer: 2,
      operations: 1,
      business: 0,
      individual: 0,
      agent: 0,
    }
    return tiers[role]
  }
}
