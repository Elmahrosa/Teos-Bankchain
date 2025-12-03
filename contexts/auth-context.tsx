"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"
import { AuthService, type User, type AuthToken } from "@/lib/auth"
import { AuditService } from "@/lib/audit"

interface AuthContextType {
  user: User | null
  token: AuthToken | null
  isAuthenticated: boolean
  isLoading: boolean
  login: (
    email: string,
    password: string,
    options?: {
      useBiometric?: boolean
      usePiBrowser?: boolean
      mfaCode?: string
      piAccessToken?: string
      piUid?: string
    },
  ) => Promise<{ requiresMFA?: boolean } | undefined>
  logout: () => Promise<void>
  hasPermission: (permission: string) => boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [token, setToken] = useState<AuthToken | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Load auth state from storage on mount
    const savedToken = AuthService.getToken()
    const savedUser = AuthService.getUser()

    if (savedToken && savedUser && AuthService.isTokenValid(savedToken)) {
      setToken(savedToken)
      setUser(savedUser)
    }

    setIsLoading(false)
  }, [])

  const login = async (
    email: string,
    password: string,
    options?: {
      useBiometric?: boolean
      usePiBrowser?: boolean
      mfaCode?: string
      piAccessToken?: string
      piUid?: string
    },
  ) => {
    const result = await AuthService.login(email, password, options)

    // If MFA is required, return early without saving auth
    if (result.requiresMFA) {
      return { requiresMFA: true }
    }

    const { token: newToken, user: newUser } = result
    AuthService.saveAuth(newToken, newUser)
    setToken(newToken)
    setUser(newUser)

    await AuditService.logEvent({
      eventType: "user_login",
      userId: newUser.id,
      userEmail: newUser.email,
      userRole: newUser.role,
      action: `User ${newUser.email} logged in successfully`,
      metadata: {
        loginTime: new Date().toISOString(),
        authMethod: options?.useBiometric
          ? "biometric"
          : options?.usePiBrowser
            ? "pi_browser"
            : options?.mfaCode
              ? "password_mfa"
              : options?.piAccessToken && options?.piUid
                ? "pi_access_token"
                : "password",
      },
    })

    return undefined
  }

  const logout = async () => {
    if (user) {
      await AuditService.logEvent({
        eventType: "user_logout",
        userId: user.id,
        userEmail: user.email,
        userRole: user.role,
        action: `User ${user.email} logged out`,
      })
    }

    await AuthService.logout()
    setToken(null)
    setUser(null)
  }

  const hasPermission = (permission: string) => {
    return AuthService.hasPermission(user, permission)
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!user && !!token,
        isLoading,
        login,
        logout,
        hasPermission,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider")
  }
  return context
}
