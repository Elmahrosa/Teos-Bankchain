"use client"

import { useEffect, useState } from "react"
import { Network } from "@capacitor/network"
import { Wifi, WifiOff, RefreshCw } from "lucide-react"
import { offlineSyncManager } from "./offline-sync"
import { Button } from "@/components/ui/button"

export function NetworkIndicator() {
  const [isOnline, setIsOnline] = useState(true)
  const [lastSync, setLastSync] = useState<string | null>(null)
  const [isSyncing, setIsSyncing] = useState(false)

  useEffect(() => {
    // Initialize network monitoring
    const checkStatus = async () => {
      const status = await Network.getStatus()
      setIsOnline(status.connected)
    }

    checkStatus()

    // Listen for network changes
    const listener = Network.addListener("networkStatusChange", (status) => {
      setIsOnline(status.connected)
    })

    // Listen for sync events
    const handleSyncComplete = (e: Event) => {
      const detail = (e as CustomEvent).detail
      setLastSync(detail.timestamp)
      setIsSyncing(false)
    }

    const handleSyncError = () => {
      setIsSyncing(false)
    }

    window.addEventListener("sync-completed", handleSyncComplete)
    window.addEventListener("sync-error", handleSyncError)

    return () => {
      listener.remove()
      window.removeEventListener("sync-completed", handleSyncComplete)
      window.removeEventListener("sync-error", handleSyncError)
    }
  }, [])

  const handleManualSync = async () => {
    setIsSyncing(true)
    await offlineSyncManager.forceSyncData()
  }

  const formatLastSync = (timestamp: string | null) => {
    if (!timestamp) return "Never"

    const date = new Date(timestamp)
    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffMins = Math.floor(diffMs / 60000)

    if (diffMins < 1) return "Just now"
    if (diffMins < 60) return `${diffMins}m ago`

    const diffHours = Math.floor(diffMins / 60)
    return `${diffHours}h ago`
  }

  return (
    <div className="flex items-center gap-2 px-3 py-2 bg-muted/50 rounded-lg border">
      {isOnline ? (
        <>
          <Wifi className="h-4 w-4 text-emerald-600" />
          <span className="text-sm font-medium text-foreground">Online</span>
        </>
      ) : (
        <>
          <WifiOff className="h-4 w-4 text-orange-600" />
          <span className="text-sm font-medium text-orange-600">Offline Mode</span>
        </>
      )}

      <span className="text-xs text-muted-foreground ml-auto">Last sync: {formatLastSync(lastSync)}</span>

      {isOnline && (
        <Button variant="ghost" size="sm" onClick={handleManualSync} disabled={isSyncing} className="h-7 w-7 p-0">
          <RefreshCw className={`h-3.5 w-3.5 ${isSyncing ? "animate-spin" : ""}`} />
        </Button>
      )}
    </div>
  )
}
