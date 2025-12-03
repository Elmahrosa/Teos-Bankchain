// Authentication and role-based access control utilities
export type UserRole = "bank_admin" | "compliance_officer" | "operations" | "business" | "individual" | "agent"

export interface User {
  id: string
  email: string
  name: string
  role: UserRole
  permissions: string[]
  organizationId?: string
  walletId?: string
  walletIds?: string[]
  primaryWalletId?: string
  approvalTier?: number
  mfaConfig?: MFAConfig
  biometricEnabled?: boolean
}

export interface AuthToken {
  accessToken: string
  refreshToken: string
  expiresAt: number
}

// Role-based permission definitions
export const ROLE_PERMISSIONS: Record<UserRole, string[]> = {
  bank_admin: [
    "view_all_transactions",
    "approve_high_value",
    "manage_users",
    "configure_settlement",
    "view_audit_logs",
    "export_reports",
    "manage_wallets",
  ],
  compliance_officer: [
    "view_all_transactions",
    "approve_compliance",
    "view_audit_logs",
    "export_reports",
    "flag_suspicious",
    "generate_regulator_reports",
  ],
  operations: ["view_transactions", "process_deposits", "process_withdrawals", "approve_low_value", "manage_agents"],
  business: ["view_own_transactions", "initiate_transfers", "view_wallet", "request_withdrawals", "view_reports"],
  individual: ["view_own_transactions", "initiate_transfers", "view_wallet", "request_withdrawals"],
  agent: ["process_cash_in", "process_cash_out", "view_assigned_transactions", "verify_identity"],
}

export const APPROVAL_TIERS: Record<UserRole, number> = {
  bank_admin: 3,
  compliance_officer: 3,
  operations: 2,
  business: 1,
  individual: 0,
  agent: 1,
}

export const TRANSACTION_LIMITS: Record<UserRole, { single: number; daily: number }> = {
  bank_admin: { single: Number.POSITIVE_INFINITY, daily: Number.POSITIVE_INFINITY },
  compliance_officer: { single: Number.POSITIVE_INFINITY, daily: Number.POSITIVE_INFINITY },
  operations: { single: 1000000, daily: 5000000 },
  business: { single: 500000, daily: 2000000 },
  individual: { single: 100000, daily: 500000 },
  agent: { single: 50000, daily: 200000 },
}

export interface BiometricCapabilities {
  available: boolean
  type: "faceID" | "fingerprint" | "none"
}

export interface PiBrowserInfo {
  isPiBrowser: boolean
  piSDKAvailable: boolean
  piUser?: {
    uid: string
    username: string
  }
}

export interface MFAConfig {
  enabled: boolean
  method: "totp" | "sms" | "email"
  verified: boolean
}

export class AuthService {
  private static TOKEN_KEY = "teos_auth_token"
  private static USER_KEY = "teos_user"
  private static API_URL = process.env.NEXT_PUBLIC_API_URL || "https://api.teosegypt.com"

  static saveAuth(token: AuthToken, user: User) {
    if (typeof window !== "undefined") {
      localStorage.setItem(this.TOKEN_KEY, JSON.stringify(token))
      localStorage.setItem(this.USER_KEY, JSON.stringify(user))
    }
  }

  static getToken(): AuthToken | null {
    if (typeof window !== "undefined") {
      const token = localStorage.getItem(this.TOKEN_KEY)
      return token ? JSON.parse(token) : null
    }
    return null
  }

  static getUser(): User | null {
    if (typeof window !== "undefined") {
      const user = localStorage.getItem(this.USER_KEY)
      return user ? JSON.parse(user) : null
    }
    return null
  }

  static clearAuth() {
    if (typeof window !== "undefined") {
      localStorage.removeItem(this.TOKEN_KEY)
      localStorage.removeItem(this.USER_KEY)
    }
  }

  static hasPermission(user: User | null, permission: string): boolean {
    return user?.permissions?.includes(permission) ?? false
  }

  static isTokenValid(token: AuthToken | null): boolean {
    if (!token) return false
    return Date.now() < token.expiresAt
  }

  static async login(
    email: string,
    password: string,
    options?: {
      useBiometric?: boolean
      usePiBrowser?: boolean
      mfaCode?: string
      piAccessToken?: string
      piUid?: string
    },
  ): Promise<{ token: AuthToken; user: User; requiresMFA?: boolean }> {
    if (options?.piAccessToken && options?.piUid) {
      console.log("[v0] Processing Pi Network authentication")

      // Create user from Pi credentials
      const piUser: User = {
        id: options.piUid,
        email: `${email}@pi.network`,
        name: email, // Pi username
        role: "individual",
        permissions: ROLE_PERMISSIONS.individual,
        walletId: options.piUid,
        walletIds: [options.piUid],
        primaryWalletId: options.piUid,
      }

      const piToken: AuthToken = {
        accessToken: options.piAccessToken,
        refreshToken: options.piAccessToken,
        expiresAt: Date.now() + 24 * 60 * 60 * 1000, // 24 hours
      }

      console.log("[v0] Pi authentication successful:", piUser.name)
      return { token: piToken, user: piUser }
    }

    if (options?.usePiBrowser) {
      const piToken = await PiBrowserService.authenticateWithPi()
      if (piToken) {
        console.log("[v0] Authenticated with Pi Browser")
      }
    }

    if (options?.useBiometric) {
      const biometricSuccess = await BiometricService.authenticate(email)
      if (!biometricSuccess) {
        throw new Error("Biometric authentication failed")
      }
    }

    if (!this.API_URL.includes("api.teosegypt.com")) {
      console.log("[v0] Demo mode: Creating mock user")
      const mockUser: User = {
        id: "demo-" + Date.now(),
        email,
        name: email.split("@")[0],
        role: "individual",
        permissions: ROLE_PERMISSIONS.individual,
      }

      const mockToken: AuthToken = {
        accessToken: "demo-token-" + Date.now(),
        refreshToken: "demo-refresh-" + Date.now(),
        expiresAt: Date.now() + 24 * 60 * 60 * 1000,
      }

      return { token: mockToken, user: mockUser }
    }

    const response = await fetch(`${this.API_URL}/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email,
        password,
        biometric: options?.useBiometric,
        piBrowser: options?.usePiBrowser,
        mfaCode: options?.mfaCode,
      }),
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.message || "Authentication failed")
    }

    const data = await response.json()

    if (data.requiresMFA) {
      return {
        token: {
          accessToken: "",
          refreshToken: "",
          expiresAt: 0,
        },
        user: {} as User,
        requiresMFA: true,
      }
    }

    return { token: data.token, user: data.user }
  }

  static async logout() {
    this.clearAuth()
  }

  static getTransactionLimits(role: UserRole): { single: number; daily: number } {
    return TRANSACTION_LIMITS[role] || { single: 0, daily: 0 }
  }
}

export class PiBrowserService {
  static detectPiBrowser(): PiBrowserInfo {
    if (typeof window === "undefined") {
      return { isPiBrowser: false, piSDKAvailable: false }
    }

    const isPiBrowser = /PiBrowser/i.test(navigator.userAgent)
    const piSDKAvailable = typeof (window as any).Pi !== "undefined"

    return {
      isPiBrowser,
      piSDKAvailable,
      piUser: piSDKAvailable ? (window as any).Pi?.user : undefined,
    }
  }

  static async authenticateWithPi(): Promise<string | null> {
    const { piSDKAvailable } = this.detectPiBrowser()
    if (!piSDKAvailable) return null

    try {
      const scopes = ["username", "payments"]
      const authResult = await (window as any).Pi.authenticate(scopes, onIncompletePaymentFound)
      return authResult.accessToken
    } catch (error) {
      console.error("[v0] Pi authentication error:", error)
      return null
    }
  }
}

function onIncompletePaymentFound(payment: any) {
  console.log("[v0] Incomplete payment found:", payment)
}

export class BiometricService {
  static async checkCapabilities(): Promise<BiometricCapabilities> {
    if (typeof window === "undefined" || !("credentials" in navigator)) {
      return { available: false, type: "none" }
    }

    try {
      const available = await (window as any).PublicKeyCredential?.isUserVerifyingPlatformAuthenticatorAvailable()
      const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent)
      const isIOS = /iPhone|iPad|iPod/i.test(navigator.userAgent)

      return {
        available: available || false,
        type: available ? (isIOS ? "faceID" : isMobile ? "fingerprint" : "fingerprint") : "none",
      }
    } catch (error) {
      return { available: false, type: "none" }
    }
  }

  static async authenticate(userId: string): Promise<boolean> {
    if (typeof window === "undefined") return false

    try {
      const credential = await navigator.credentials.get({
        publicKey: {
          challenge: new Uint8Array(32),
          rpId: window.location.hostname,
          userVerification: "required",
          timeout: 60000,
        },
      } as any)

      return !!credential
    } catch (error) {
      console.error("[v0] Biometric authentication error:", error)
      return false
    }
  }

  static async register(userId: string, userName: string): Promise<boolean> {
    if (typeof window === "undefined") return false

    try {
      const credential = await navigator.credentials.create({
        publicKey: {
          challenge: new Uint8Array(32),
          rp: { name: "TEOS Bankchain", id: window.location.hostname },
          user: {
            id: new TextEncoder().encode(userId),
            name: userName,
            displayName: userName,
          },
          pubKeyCredParams: [{ alg: -7, type: "public-key" }],
          authenticatorSelection: {
            authenticatorAttachment: "platform",
            userVerification: "required",
          },
          timeout: 60000,
        },
      } as any)

      return !!credential
    } catch (error) {
      console.error("[v0] Biometric registration error:", error)
      return false
    }
  }
}
