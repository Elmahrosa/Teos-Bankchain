"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Wallet, CheckCircle, AlertCircle, Loader2 } from "lucide-react"
import { PiNetworkService, type PiUser } from "@/lib/pi-network"

export function PiWalletConnector() {
  const [isPiBrowser, setIsPiBrowser] = useState(false)
  const [piUser, setPiUser] = useState<PiUser | null>(null)
  const [isConnecting, setIsConnecting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    setIsPiBrowser(PiNetworkService.isPiBrowser())
  }, [])

  const handleConnect = async () => {
    setIsConnecting(true)
    setError(null)

    try {
      const user = await PiNetworkService.authenticate()
      setPiUser(user)

      // Save to localStorage
      localStorage.setItem("pi_user", JSON.stringify(user))

      console.log("[v0] Pi user connected:", user)
    } catch (err: any) {
      setError(err.message || "Failed to connect Pi wallet")
      console.error("[v0] Pi connection error:", err)
    } finally {
      setIsConnecting(false)
    }
  }

  const handleDisconnect = () => {
    setPiUser(null)
    localStorage.removeItem("pi_user")
  }

  useEffect(() => {
    // Check for saved Pi user
    const savedUser = localStorage.getItem("pi_user")
    if (savedUser) {
      try {
        setPiUser(JSON.parse(savedUser))
      } catch (e) {
        localStorage.removeItem("pi_user")
      }
    }
  }, [])

  if (!isPiBrowser) {
    return (
      <Card className="border-amber-500/20 bg-amber-500/5">
        <CardHeader>
          <div className="flex items-center gap-2">
            <AlertCircle className="w-5 h-5 text-amber-500" />
            <CardTitle className="text-base">Pi Browser Required</CardTitle>
          </div>
          <CardDescription className="text-xs">
            Please open TEOS BankChain in the Pi Browser app to connect your Pi wallet
          </CardDescription>
        </CardHeader>
      </Card>
    )
  }

  if (piUser) {
    return (
      <Card className="border-primary/20 bg-primary/5">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-primary" />
              <CardTitle className="text-base">Pi Wallet Connected</CardTitle>
            </div>
            <Badge className="bg-primary/20 text-primary border-primary/30">Active</Badge>
          </div>
          <CardDescription className="text-xs">Your Pi Network account is linked to TEOS BankChain</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="bg-muted p-3 rounded-lg">
            <p className="text-xs text-muted-foreground mb-1">Pi Username</p>
            <p className="font-semibold">@{piUser.username}</p>
          </div>
          <div className="bg-muted p-3 rounded-lg">
            <p className="text-xs text-muted-foreground mb-1">User ID</p>
            <p className="font-mono text-sm break-all">{piUser.uid}</p>
          </div>
          <Button variant="outline" size="sm" onClick={handleDisconnect} className="w-full bg-transparent">
            Disconnect Pi Wallet
          </Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <Wallet className="w-5 h-5 text-primary" />
          <CardTitle className="text-base">Connect Pi Wallet</CardTitle>
        </div>
        <CardDescription className="text-xs">
          Link your Pi Network account to enable Pi payments and transfers
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        {error && (
          <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-3">
            <p className="text-xs text-destructive">{error}</p>
          </div>
        )}
        <Button onClick={handleConnect} disabled={isConnecting} className="w-full">
          {isConnecting ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Connecting...
            </>
          ) : (
            <>
              <Wallet className="w-4 h-4 mr-2" />
              Connect Pi Wallet
            </>
          )}
        </Button>
        <div className="bg-muted p-3 rounded-lg">
          <p className="text-xs text-muted-foreground">
            By connecting, you authorize TEOS BankChain to access your Pi username and process payments on your behalf.
          </p>
        </div>
      </CardContent>
    </Card>
  )
}
