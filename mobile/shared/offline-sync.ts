import { offlineStorage, type OfflineData } from "./offline-storage"
import { apiClient } from "../../frontend/web/lib/api-client"
import { Network } from "@capacitor/network"

export class OfflineSyncManager {
  private syncInProgress = false
  private syncInterval: NodeJS.Timeout | null = null

  /**
   * Initialize sync manager
   */
  async initialize(): Promise<void> {
    // Listen for network status changes
    Network.addListener("networkStatusChange", (status) => {
      console.log("[v0] Network status changed:", status.connected)

      if (status.connected && !this.syncInProgress) {
        this.syncData()
      }
    })

    // Start periodic sync (every 5 minutes when online)
    this.startPeriodicSync()

    // Initial sync if online
    const status = await Network.getStatus()
    if (status.connected) {
      this.syncData()
    }
  }

  /**
   * Check if device is online
   */
  async isOnline(): Promise<boolean> {
    try {
      const status = await Network.getStatus()
      return status.connected
    } catch (error) {
      return navigator.onLine
    }
  }

  /**
   * Sync data with backend
   */
  async syncData(): Promise<void> {
    if (this.syncInProgress) {
      console.log("[v0] Sync already in progress")
      return
    }

    const online = await this.isOnline()
    if (!online) {
      console.log("[v0] Device offline, skipping sync")
      return
    }

    try {
      this.syncInProgress = true
      console.log("[v0] Starting data sync...")

      // Fetch fresh data from backend
      const [transactions, wallets, fxRates] = await Promise.all([
        this.fetchTransactions(),
        this.fetchWallets(),
        this.fetchFXRates(),
      ])

      // Save to offline storage
      await offlineStorage.saveOfflineData({
        transactions,
        wallets,
        fxRates,
      })

      console.log("[v0] Data sync completed successfully")

      // Dispatch sync complete event
      window.dispatchEvent(
        new CustomEvent("sync-completed", {
          detail: { timestamp: new Date().toISOString() },
        }),
      )
    } catch (error) {
      console.error("[v0] Sync failed:", error)

      // Dispatch sync error event
      window.dispatchEvent(
        new CustomEvent("sync-error", {
          detail: { error: error instanceof Error ? error.message : "Unknown error" },
        }),
      )
    } finally {
      this.syncInProgress = false
    }
  }

  /**
   * Force sync data
   */
  async forceSyncData(): Promise<void> {
    return this.syncData()
  }

  /**
   * Get data with offline fallback
   */
  async getDataWithFallback<T>(fetchFn: () => Promise<T>, offlineKey: keyof OfflineData): Promise<T> {
    const online = await this.isOnline()

    if (online) {
      try {
        // Try to fetch from API
        const data = await fetchFn()

        // Update offline cache
        await offlineStorage.saveOfflineData({
          [offlineKey]: data,
        } as any)

        return data
      } catch (error) {
        console.warn("[v0] API call failed, falling back to offline data")
      }
    }

    // Fallback to offline data
    const offlineData = await offlineStorage.getOfflineData()
    return offlineData[offlineKey] as T
  }

  /**
   * Start periodic sync
   */
  private startPeriodicSync(): void {
    if (this.syncInterval) {
      clearInterval(this.syncInterval)
    }

    // Sync every 5 minutes
    this.syncInterval = setInterval(
      () => {
        this.syncData()
      },
      5 * 60 * 1000,
    )
  }

  /**
   * Stop periodic sync
   */
  stopPeriodicSync(): void {
    if (this.syncInterval) {
      clearInterval(this.syncInterval)
      this.syncInterval = null
    }
  }

  private async fetchTransactions(): Promise<any[]> {
    try {
      const response = await apiClient.get("/v1/transactions?limit=50")
      return response.transactions || []
    } catch (error) {
      console.error("[v0] Failed to fetch transactions:", error)
      return []
    }
  }

  private async fetchWallets(): Promise<any[]> {
    try {
      const response = await apiClient.get("/v1/wallets")
      return response.wallets || []
    } catch (error) {
      console.error("[v0] Failed to fetch wallets:", error)
      return []
    }
  }

  private async fetchFXRates(): Promise<any[]> {
    try {
      const response = await apiClient.get("/v1/fx/rates")
      return response.rates || []
    } catch (error) {
      console.error("[v0] Failed to fetch FX rates:", error)
      return []
    }
  }
}

export const offlineSyncManager = new OfflineSyncManager()
