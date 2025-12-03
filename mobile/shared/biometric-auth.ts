import { Capacitor } from "@capacitor/core"
import { NativeBiometric, type BiometricOptions } from "@capgo/capacitor-native-biometric"
import { SecureStoragePlugin } from "@aparajita/capacitor-secure-storage"
import CryptoJS from "crypto-js"

export interface BiometricCheckResult {
  isAvailable: boolean
  biometryType?: "fingerprint" | "face" | "iris" | "none"
  error?: string
}

export interface BiometricCredentials {
  username: string
  password?: string
  token?: string
}

export class PINAuthService {
  private static PIN_KEY = "teos_user_pin"
  private static PIN_ATTEMPTS_KEY = "teos_pin_attempts"
  private static MAX_ATTEMPTS = 5

  /**
   * Set user PIN (hashed and stored securely)
   */
  static async setPIN(pin: string): Promise<boolean> {
    try {
      // Hash PIN before storing
      const hashedPin = CryptoJS.SHA256(pin).toString()

      if (Capacitor.isNativePlatform()) {
        await SecureStoragePlugin.set(this.PIN_KEY, hashedPin)
      } else {
        localStorage.setItem(this.PIN_KEY, hashedPin)
      }

      // Reset attempts
      await this.resetAttempts()
      return true
    } catch (error) {
      console.error("[v0] Failed to set PIN:", error)
      return false
    }
  }

  /**
   * Verify PIN
   */
  static async verifyPIN(pin: string): Promise<boolean> {
    try {
      // Check if locked due to too many attempts
      const attempts = await this.getAttempts()
      if (attempts >= this.MAX_ATTEMPTS) {
        throw new Error("Too many failed attempts. Please wait 30 minutes.")
      }

      // Get stored PIN hash
      let storedHash: string | null = null
      if (Capacitor.isNativePlatform()) {
        storedHash = await SecureStoragePlugin.get(this.PIN_KEY)
      } else {
        storedHash = localStorage.getItem(this.PIN_KEY)
      }

      if (!storedHash) {
        return false
      }

      // Compare hashes
      const inputHash = CryptoJS.SHA256(pin).toString()
      const isValid = inputHash === storedHash

      if (isValid) {
        await this.resetAttempts()
      } else {
        await this.incrementAttempts()
      }

      return isValid
    } catch (error) {
      console.error("[v0] PIN verification failed:", error)
      throw error
    }
  }

  /**
   * Check if PIN is set
   */
  static async hasPIN(): Promise<boolean> {
    try {
      if (Capacitor.isNativePlatform()) {
        const pin = await SecureStoragePlugin.get(this.PIN_KEY)
        return !!pin
      } else {
        return !!localStorage.getItem(this.PIN_KEY)
      }
    } catch (error) {
      return false
    }
  }

  /**
   * Delete PIN
   */
  static async deletePIN(): Promise<boolean> {
    try {
      if (Capacitor.isNativePlatform()) {
        await SecureStoragePlugin.remove(this.PIN_KEY)
      } else {
        localStorage.removeItem(this.PIN_KEY)
      }
      await this.resetAttempts()
      return true
    } catch (error) {
      console.error("[v0] Failed to delete PIN:", error)
      return false
    }
  }

  private static async getAttempts(): Promise<number> {
    try {
      const attempts = localStorage.getItem(this.PIN_ATTEMPTS_KEY)
      return attempts ? Number.parseInt(attempts) : 0
    } catch (error) {
      return 0
    }
  }

  private static async incrementAttempts(): Promise<void> {
    const current = await this.getAttempts()
    localStorage.setItem(this.PIN_ATTEMPTS_KEY, (current + 1).toString())

    // Set lockout timer if max attempts reached
    if (current + 1 >= this.MAX_ATTEMPTS) {
      setTimeout(() => this.resetAttempts(), 30 * 60 * 1000) // 30 minutes
    }
  }

  private static async resetAttempts(): Promise<void> {
    localStorage.removeItem(this.PIN_ATTEMPTS_KEY)
  }
}

export class BiometricAuthService {
  /**
   * Check if biometric authentication is available
   */
  static async checkAvailability(): Promise<BiometricCheckResult> {
    if (!Capacitor.isNativePlatform()) {
      return {
        isAvailable: false,
        biometryType: "none",
        error: "Not a native platform",
      }
    }

    try {
      const result = await NativeBiometric.isAvailable()
      return {
        isAvailable: result.isAvailable,
        biometryType: result.biometryType as any,
      }
    } catch (error) {
      return {
        isAvailable: false,
        biometryType: "none",
        error: error instanceof Error ? error.message : "Unknown error",
      }
    }
  }

  /**
   * Authenticate user with biometrics
   */
  static async authenticate(reason?: string): Promise<boolean> {
    try {
      const options: BiometricOptions = {
        reason: reason || "Authenticate to access TEOS Bankchain",
        title: "Biometric Authentication",
        subtitle: "Use your biometric to login",
        description: "Place your finger on the sensor or look at the camera",
        negativeButtonText: "Cancel",
      }

      await NativeBiometric.verifyIdentity(options)
      return true
    } catch (error) {
      console.error("[v0] Biometric authentication failed:", error)
      return false
    }
  }

  /**
   * Save credentials securely with biometric protection
   */
  static async saveCredentials(credentials: BiometricCredentials): Promise<boolean> {
    try {
      await NativeBiometric.setCredentials({
        username: credentials.username,
        password: credentials.password || credentials.token || "",
        server: "teos-bankchain",
      })
      return true
    } catch (error) {
      console.error("[v0] Failed to save credentials:", error)
      return false
    }
  }

  /**
   * Get saved credentials with biometric authentication
   */
  static async getCredentials(): Promise<BiometricCredentials | null> {
    try {
      // First authenticate
      const authenticated = await this.authenticate("Authenticate to retrieve your credentials")

      if (!authenticated) {
        return null
      }

      // Get credentials
      const result = await NativeBiometric.getCredentials({
        server: "teos-bankchain",
      })

      return {
        username: result.username,
        password: result.password,
        token: result.password, // Using password field for token
      }
    } catch (error) {
      console.error("[v0] Failed to get credentials:", error)
      return null
    }
  }

  /**
   * Delete saved credentials
   */
  static async deleteCredentials(): Promise<boolean> {
    try {
      await NativeBiometric.deleteCredentials({
        server: "teos-bankchain",
      })
      return true
    } catch (error) {
      console.error("[v0] Failed to delete credentials:", error)
      return false
    }
  }

  /**
   * Authenticate with biometric or PIN fallback
   */
  static async authenticateWithFallback(reason?: string): Promise<{
    success: boolean
    method: "biometric" | "pin" | "none"
  }> {
    // Check if biometrics are available
    const biometricAvailability = await this.checkAvailability()

    if (biometricAvailability.isAvailable) {
      // Try biometric first
      const biometricSuccess = await this.authenticate(reason)

      if (biometricSuccess) {
        return { success: true, method: "biometric" }
      }

      // Biometric failed, offer PIN fallback
      console.log("[v0] Biometric auth failed, falling back to PIN")
    }

    // Check if PIN is set
    const hasPIN = await PINAuthService.hasPIN()

    if (hasPIN) {
      // PIN authentication should be handled by UI
      // This returns to indicate PIN is needed
      return { success: false, method: "pin" }
    }

    return { success: false, method: "none" }
  }
}
