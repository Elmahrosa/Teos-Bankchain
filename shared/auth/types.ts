export type UserRole = "bank_admin" | "compliance_officer" | "operations" | "business" | "individual" | "agent"

export interface User {
  id: string
  email: string
  name: string
  role: UserRole
  permissions: Permission[]
  mfaEnabled: boolean
  biometricEnabled: boolean
  createdAt: string
  lastLogin?: string
}

export interface Permission {
  resource: string
  actions: ("create" | "read" | "update" | "delete")[]
}

export interface AuthToken {
  accessToken: string
  refreshToken?: string
  expiresAt: number
  tokenType: string
}

export interface LoginRequest {
  email: string
  password: string
  mfaCode?: string
  biometricToken?: string
}

export interface LoginResponse {
  user: User
  token: AuthToken
  requiresMfa: boolean
}
