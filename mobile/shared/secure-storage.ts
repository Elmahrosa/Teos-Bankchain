import { Capacitor } from "@capacitor/core"
import type { SecureStoragePlugin } from "@capacitor-community/secure-storage"

export class SecureStorage {
  private static instance: SecureStoragePlugin | null = null

  private static async getPlugin(): Promise<SecureStoragePlugin | null> {
    if (!Capacitor.isNativePlatform()) {
      console.warn("[v0] Secure storage not available on web platform")
      return null
    }

    if (!this.instance) {
      const { SecureStoragePlugin: Plugin } = await import("@capacitor-community/secure-storage")
      this.instance = Plugin
    }

    return this.instance
  }

  /**
   * Set a value in secure storage
   */
  static async set(key: string, value: string): Promise<boolean> {
    const plugin = await this.getPlugin()

    if (!plugin) {
      // Fallback to localStorage on web
      if (typeof window !== "undefined") {
        localStorage.setItem(`secure_${key}`, value)
        return true
      }
      return false
    }

    try {
      await plugin.set({ key, value })
      return true
    } catch (error) {
      console.error("[v0] Failed to set secure storage:", error)
      return false
    }
  }

  /**
   * Get a value from secure storage
   */
  static async get(key: string): Promise<string | null> {
    const plugin = await this.getPlugin()

    if (!plugin) {
      // Fallback to localStorage on web
      if (typeof window !== "undefined") {
        return localStorage.getItem(`secure_${key}`)
      }
      return null
    }

    try {
      const { value } = await plugin.get({ key })
      return value
    } catch (error) {
      console.error("[v0] Failed to get secure storage:", error)
      return null
    }
  }

  /**
   * Remove a value from secure storage
   */
  static async remove(key: string): Promise<boolean> {
    const plugin = await this.getPlugin()

    if (!plugin) {
      // Fallback to localStorage on web
      if (typeof window !== "undefined") {
        localStorage.removeItem(`secure_${key}`)
        return true
      }
      return false
    }

    try {
      await plugin.remove({ key })
      return true
    } catch (error) {
      console.error("[v0] Failed to remove from secure storage:", error)
      return false
    }
  }

  /**
   * Clear all secure storage
   */
  static async clear(): Promise<boolean> {
    const plugin = await this.getPlugin()

    if (!plugin) {
      // Fallback to localStorage on web
      if (typeof window !== "undefined") {
        const keys = Object.keys(localStorage).filter((k) => k.startsWith("secure_"))
        keys.forEach((k) => localStorage.removeItem(k))
        return true
      }
      return false
    }

    try {
      await plugin.clear()
      return true
    } catch (error) {
      console.error("[v0] Failed to clear secure storage:", error)
      return false
    }
  }
}
