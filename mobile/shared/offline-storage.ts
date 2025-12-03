import { Capacitor } from "@capacitor/core"
import type CryptoJSType from "crypto-js"

// Declare CryptoJS for browser/Node compatibility
declare const CryptoJS: typeof CryptoJSType

interface OfflineData {
  transactions: any[]
  wallets: any[]
  fxRates: any[]
  lastSync: string
}

interface SecureStorage {
  set(key: string, value: string): Promise<void>
  get(key: string): Promise<string | null>
  remove(key: string): Promise<void>
}

const SecureStoragePlugin: SecureStorage | null = null

async function getSecureStorage(): Promise<SecureStorage | null> {
  if (Capacitor.isNativePlatform()) {
    try {
      const { SecureStoragePlugin: Plugin } = await import("@aparajita/capacitor-secure-storage")
      return Plugin as unknown as SecureStorage
    } catch (error) {
      console.warn("[v0] SecureStoragePlugin not available:", error)
      return null
    }
  }
  return null
}

export class OfflineStorage {
  private storageKey = "teos_offline_data"
  private encryptionKey: string

  constructor() {
    this.encryptionKey = this.getEncryptionKey()
  }

  async saveOfflineData(data: Partial<OfflineData>): Promise<void> {
    try {
      const existingData = await this.getOfflineData()
      const mergedData = { ...existingData, ...data, lastSync: new Date().toISOString() }

      const CryptoJSModule = await import("crypto-js")
      const encrypted = CryptoJSModule.default.AES.encrypt(JSON.stringify(mergedData), this.encryptionKey).toString()

      if (Capacitor.isNativePlatform()) {
        const storage = await getSecureStorage()
        if (storage) {
          await storage.set(this.storageKey, encrypted)
        } else {
          // Fallback to localStorage
          if (typeof window !== "undefined") {
            localStorage.setItem(this.storageKey, encrypted)
          }
        }
      } else {
        if (typeof window !== "undefined") {
          localStorage.setItem(this.storageKey, encrypted)
        }
      }
    } catch (error) {
      console.error("[v0] Error saving offline data:", error)
      throw error
    }
  }

  async getOfflineData(): Promise<OfflineData> {
    try {
      let encrypted: string | null = null

      if (Capacitor.isNativePlatform()) {
        const storage = await getSecureStorage()
        if (storage) {
          encrypted = await storage.get(this.storageKey)
        }
      } else {
        if (typeof window !== "undefined") {
          encrypted = localStorage.getItem(this.storageKey)
        }
      }

      if (!encrypted) {
        return this.getEmptyData()
      }

      const CryptoJSModule = await import("crypto-js")
      const decrypted = CryptoJSModule.default.AES.decrypt(encrypted, this.encryptionKey).toString(
        CryptoJSModule.default.enc.Utf8,
      )
      return JSON.parse(decrypted)
    } catch (error) {
      console.error("[v0] Error getting offline data:", error)
      return this.getEmptyData()
    }
  }

  async clearOfflineData(): Promise<void> {
    try {
      if (Capacitor.isNativePlatform()) {
        const storage = await getSecureStorage()
        if (storage) {
          await storage.remove(this.storageKey)
        }
      } else {
        if (typeof window !== "undefined") {
          localStorage.removeItem(this.storageKey)
        }
      }
    } catch (error) {
      console.error("[v0] Error clearing offline data:", error)
    }
  }

  async needsSync(): Promise<boolean> {
    const data = await this.getOfflineData()
    if (!data.lastSync) return true

    const lastSync = new Date(data.lastSync)
    const now = new Date()
    const diffMinutes = (now.getTime() - lastSync.getTime()) / (1000 * 60)

    return diffMinutes > 5
  }

  private getEncryptionKey(): string {
    if (typeof window === "undefined") return "default-key"

    const storedKey = localStorage.getItem("teos_encryption_key")
    if (storedKey) return storedKey

    const newKey = Math.random().toString(36).substring(2) + Date.now().toString(36)
    localStorage.setItem("teos_encryption_key", newKey)
    return newKey
  }

  private getEmptyData(): OfflineData {
    return {
      transactions: [],
      wallets: [],
      fxRates: [],
      lastSync: "",
    }
  }
}

export const offlineStorage = new OfflineStorage()
