"use client"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/contexts/auth-context"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Building2, Wallet, AlertCircle, TestTube, Crown } from "lucide-react"
import { PiNetworkService } from "@/lib/pi-network"
import { ContactBadge } from "@/components/contact-badge"
import Link from "next/link"

export default function LoginPage() {
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [sdkReady, setSdkReady] = useState(false)

  const { login } = useAuth()
  const router = useRouter()

  useEffect(() => {
    let attempts = 0
    const maxAttempts = 15

    const checkPiSDK = () => {
      attempts++

      if (typeof window !== "undefined" && window.Pi) {
        setSdkReady(true)
        return true
      }

      if (attempts < maxAttempts) {
        setTimeout(checkPiSDK, 500)
      }

      return false
    }

    const timer = setTimeout(checkPiSDK, 300)
    return () => clearTimeout(timer)
  }, [])

  const handlePiWalletLogin = async () => {
    setError("")
    setIsLoading(true)

    try {
      if (!window.Pi) {
        throw new Error("Pi SDK not available")
      }

      const piUser = await PiNetworkService.authenticate()

      const founderWalletAddress = "GDIW2DXDR3DU4CYTRHDS3WYDGHMUQZG7E5FJWWW6XSADOC5VHMYRYD6F"
      const isFounder =
        piUser.username.toLowerCase() === "aasm1969" || (piUser as any).walletAddress === founderWalletAddress

      await login(piUser.username, "", {
        usePiBrowser: true,
        piAccessToken: piUser.accessToken,
        piUid: piUser.uid,
      })

      router.push(isFounder ? "/founder-dashboard" : "/dashboard")
    } catch (err: any) {
      setError(err.message || "Pi Wallet authentication failed")
    } finally {
      setIsLoading(false)
    }
  }

  const handleDemoMode = async () => {
    setError("")
    setIsLoading(true)

    try {
      await login("demo_user", "", {
        usePiBrowser: false,
        piAccessToken: "demo_token",
        piUid: "demo_uid",
      })

      router.push("/dashboard")
    } catch (err: any) {
      setError(err.message || "Demo login failed")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/10 via-background to-accent/10 flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md mb-4">
        <Alert className="bg-amber-50 dark:bg-amber-950 border-amber-200 dark:border-amber-800">
          <AlertDescription className="text-center text-sm text-amber-900 dark:text-amber-100">
            <strong>Development App</strong> - Pending Pi Core Team Verification
          </AlertDescription>
        </Alert>
      </div>

      <Card className="w-full max-w-md shadow-lg">
        <CardHeader className="space-y-4 text-center">
          <div className="mx-auto w-16 h-16 bg-gradient-to-br from-primary via-primary to-primary/80 rounded-2xl flex items-center justify-center shadow-lg">
            <Building2 className="w-8 h-8 text-primary-foreground" />
          </div>
          <div>
            <CardTitle className="text-2xl">TEOS BankChain</CardTitle>
            <CardDescription className="text-base mt-2">Secure Banking Powered by Pi Network</CardDescription>
            <div className="mt-3">
              <ContactBadge variant="compact" />
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <Button onClick={handlePiWalletLogin} className="w-full h-12 text-base" disabled={isLoading || !sdkReady}>
            <Wallet className="w-5 h-5 mr-2" />
            {isLoading ? "Connecting..." : !sdkReady ? "Waiting for Pi SDK..." : "Connect Pi Wallet"}
          </Button>

          <div className="grid grid-cols-2 gap-3">
            <Button onClick={handleDemoMode} variant="outline" className="h-11 bg-transparent" disabled={isLoading}>
              <TestTube className="w-4 h-4 mr-2" />
              Use Demo Mode
            </Button>

            <Button asChild variant="outline" className="h-11 bg-transparent">
              <Link href="/founder-login">
                <Crown className="w-4 h-4 mr-2" />
                Founder Dashboard
              </Link>
            </Button>
          </div>

          <div className="text-center space-y-3 pt-4 border-t">
            <p className="text-sm text-muted-foreground">By connecting your Pi Wallet, you agree to our</p>
            <div className="flex gap-4 justify-center">
              <Link href="/terms" className="text-sm text-primary hover:underline font-medium">
                Terms of Service
              </Link>
              <span className="text-muted-foreground">•</span>
              <Link href="/privacy" className="text-sm text-primary hover:underline font-medium">
                Privacy Policy
              </Link>
            </div>
            <p className="text-xs text-muted-foreground pt-2">KYC/AML Compliant • ISO-20022 Certified • MENA Region</p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
