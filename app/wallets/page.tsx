"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/contexts/auth-context"
import { Header } from "@/components/header"
import { BottomNav } from "@/components/bottom-nav"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Lock, Unlock, ArrowUpRight, ArrowDownLeft, Shield, Plus, TrendingUp, RefreshCw, Clock } from "lucide-react"
import { WalletService, type Wallet as WalletLib, type WalletTransaction } from "@/lib/wallet"
import { FXService, type FXRate } from "@/lib/fx"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { PiWalletConnector } from "@/components/pi-wallet-connector"

export default function WalletsPage() {
  const { isAuthenticated, isLoading, user } = useAuth()
  const router = useRouter()
  const [wallets, setWallets] = useState<WalletLib[]>([])
  const [fxRates, setFxRates] = useState<FXRate[]>([])
  const [pendingWithdrawals, setPendingWithdrawals] = useState<WalletTransaction[]>([])
  const [isLoadingData, setIsLoadingData] = useState(true)
  const [isCreating, setIsCreating] = useState(false)
  const [newWalletType, setNewWalletType] = useState<"custodial" | "non_custodial">("custodial")
  const [newWalletCurrency, setNewWalletCurrency] = useState<"EGP" | "USD" | "SAR" | "PI">("EGP")
  const [newWalletName, setNewWalletName] = useState("")

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push("/login")
      return
    }

    if (user?.id) {
      loadData()
    }
  }, [isAuthenticated, isLoading, router, user])

  const loadData = async () => {
    if (!user?.id) return
    setIsLoadingData(true)
    try {
      const [userWallets, rates, pending] = await Promise.all([
        WalletService.getWallets(user.id),
        FXService.getRates(),
        user.role === "bank_admin" || user.role === "compliance_officer" || user.role === "operations"
          ? WalletService.getPendingWithdrawals()
          : Promise.resolve([]),
      ])
      setWallets(userWallets)
      setFxRates(rates)
      setPendingWithdrawals(pending)
    } catch (error) {
      console.error("[v0] Error loading wallet data:", error)
    } finally {
      setIsLoadingData(false)
    }
  }

  const handleCreateWallet = async () => {
    if (!user?.id) return
    setIsCreating(true)

    try {
      await WalletService.createWallet(user.id, newWalletType, newWalletCurrency, newWalletName || undefined)
      await loadData()
      setNewWalletName("")
      setIsCreating(false)
    } catch (error) {
      console.error("[v0] Failed to create wallet:", error)
      setIsCreating(false)
    }
  }

  if (isLoading || !isAuthenticated) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background pb-20">
      <Header />
      <main className="px-4 pt-4 pb-6 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">My Wallets</h1>
            <p className="text-sm text-muted-foreground">Multi-currency accounts with live FX rates</p>
          </div>
          <Dialog>
            <DialogTrigger asChild>
              <Button size="sm">
                <Plus className="w-4 h-4 mr-1" />
                New
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create New Wallet</DialogTitle>
                <DialogDescription>Add a new wallet to your account</DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label>Wallet Name</Label>
                  <Input
                    placeholder="e.g., Business Account"
                    value={newWalletName}
                    onChange={(e) => setNewWalletName(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Wallet Type</Label>
                  <Select value={newWalletType} onValueChange={(v: any) => setNewWalletType(v)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="custodial">Custodial (Bank-managed)</SelectItem>
                      <SelectItem value="non_custodial">Non-Custodial (Self-custody)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Currency</Label>
                  <Select value={newWalletCurrency} onValueChange={(v: any) => setNewWalletCurrency(v)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="EGP">Egyptian Pound (EGP)</SelectItem>
                      <SelectItem value="USD">US Dollar (USD)</SelectItem>
                      <SelectItem value="SAR">Saudi Riyal (SAR)</SelectItem>
                      <SelectItem value="PI">Pi Network (π)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <Button onClick={handleCreateWallet} className="w-full" disabled={isCreating}>
                  {isCreating ? "Creating..." : "Create Wallet"}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        <PiWalletConnector />

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-base">Live Exchange Rates</CardTitle>
                <CardDescription className="text-xs">Updated from Central Bank + Pi Oracle</CardDescription>
              </div>
              <Button size="sm" variant="ghost" onClick={loadData}>
                <RefreshCw className="w-4 h-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-2">
              {fxRates.slice(0, 6).map((rate) => (
                <div key={`${rate.from}-${rate.to}`} className="border rounded-lg p-2">
                  <div className="flex items-center gap-1 mb-1">
                    <span className="text-xs font-semibold">{rate.from}</span>
                    <TrendingUp className="w-3 h-3 text-green-500" />
                    <span className="text-xs font-semibold">{rate.to}</span>
                  </div>
                  <p className="text-lg font-bold">{rate.rate.toFixed(4)}</p>
                  <p className="text-xs text-muted-foreground">{new Date(rate.lastUpdated).toLocaleTimeString()}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {pendingWithdrawals.length > 0 &&
          (user?.role === "bank_admin" || user?.role === "compliance_officer" || user?.role === "operations") && (
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-base">Pending Approvals</CardTitle>
                    <CardDescription className="text-xs">Withdrawals requiring your review</CardDescription>
                  </div>
                  <Badge variant="destructive">{pendingWithdrawals.length}</Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                {pendingWithdrawals.map((tx) => (
                  <div key={tx.id} className="border rounded-lg p-3 space-y-2">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-semibold text-sm">
                          {tx.amount.toLocaleString()} {tx.currency}
                        </p>
                        <p className="text-xs text-muted-foreground">To: {tx.metadata?.reference}</p>
                      </div>
                      <Clock className="w-5 h-5 text-orange-500" />
                    </div>
                    <div className="flex gap-1">
                      {tx.approvals.map((approval, idx) => (
                        <Badge
                          key={idx}
                          variant={
                            approval.status === "approved"
                              ? "secondary"
                              : approval.status === "rejected"
                                ? "destructive"
                                : "outline"
                          }
                          className="text-xs"
                        >
                          Tier {approval.tier}: {approval.status}
                        </Badge>
                      ))}
                    </div>
                    <Button
                      size="sm"
                      variant="outline"
                      className="w-full bg-transparent"
                      onClick={() => router.push("/admin/approvals")}
                    >
                      Review
                    </Button>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}

        <Tabs defaultValue="all" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="custodial">Custodial</TabsTrigger>
            <TabsTrigger value="non_custodial">Non-Custodial</TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="space-y-4 mt-4">
            {wallets.map((wallet) => (
              <WalletCard key={wallet.id} wallet={wallet} router={router} />
            ))}
          </TabsContent>

          <TabsContent value="custodial" className="space-y-4 mt-4">
            {wallets
              .filter((w) => w.type === "custodial")
              .map((wallet) => (
                <WalletCard key={wallet.id} wallet={wallet} router={router} />
              ))}
          </TabsContent>

          <TabsContent value="non_custodial" className="space-y-4 mt-4">
            {wallets
              .filter((w) => w.type === "non_custodial")
              .map((wallet) => (
                <WalletCard key={wallet.id} wallet={wallet} router={router} />
              ))}
          </TabsContent>
        </Tabs>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Wallet Types</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-start gap-3">
              <Lock className="w-5 h-5 text-primary mt-0.5" />
              <div className="flex-1">
                <h4 className="font-semibold text-sm">Custodial Wallet</h4>
                <p className="text-xs text-muted-foreground mt-1">
                  TEOS Egypt manages your funds with bank-grade security, insurance, and approval workflows.
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Unlock className="w-5 h-5 text-accent mt-0.5" />
              <div className="flex-1">
                <h4 className="font-semibold text-sm">Non-Custodial Wallet</h4>
                <p className="text-xs text-muted-foreground mt-1">
                  You control your private keys. Full self-custody with Pi Network integration.
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Shield className="w-5 h-5 text-primary mt-0.5" />
              <div className="flex-1">
                <h4 className="font-semibold text-sm">Role-Based Permissions</h4>
                <p className="text-xs text-muted-foreground mt-1">
                  Multi-tier approval workflows based on transaction amounts and your account role.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>
      <BottomNav />
    </div>
  )
}

function WalletCard({ wallet, router }: { wallet: WalletLib; router: any }) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-500/10 text-green-600 border-green-500/20"
      case "suspended":
        return "bg-yellow-500/10 text-yellow-600 border-yellow-500/20"
      case "closed":
        return "bg-red-500/10 text-red-600 border-red-500/20"
      default:
        return "bg-gray-500/10 text-gray-600 border-gray-500/20"
    }
  }

  const getCurrencySymbol = (currency: string) => {
    switch (currency) {
      case "PI":
        return "π "
      case "USD":
        return "$"
      case "SAR":
        return "﷼"
      default:
        return ""
    }
  }

  const getCurrencySuffix = (currency: string) => {
    return currency === "EGP" || currency === "SAR" ? ` ${currency}` : ""
  }

  return (
    <Card className="overflow-hidden">
      <div className={`h-1 ${wallet.type === "custodial" ? "bg-primary" : "bg-accent"}`} />
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div
              className={`w-10 h-10 rounded-full flex items-center justify-center ${wallet.type === "custodial" ? "bg-primary/10" : "bg-accent/10"}`}
            >
              {wallet.type === "custodial" ? (
                <Lock className="w-5 h-5 text-primary" />
              ) : (
                <Unlock className="w-5 h-5 text-accent" />
              )}
            </div>
            <div>
              <CardTitle className="text-base">{wallet.name}</CardTitle>
              <CardDescription className="text-xs">
                {wallet.type === "custodial" ? "Custodial" : "Non-Custodial"} • {wallet.currency}
              </CardDescription>
            </div>
          </div>
          <Badge className={getStatusColor(wallet.status)}>{wallet.status}</Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <p className="text-xs text-muted-foreground">Balance</p>
          <p className="text-2xl font-bold">
            {getCurrencySymbol(wallet.currency)}
            {wallet.balance.toLocaleString()}
            {getCurrencySuffix(wallet.currency)}
          </p>
          <div className="flex gap-4 mt-1 text-xs text-muted-foreground">
            <span>Available: {wallet.availableBalance.toLocaleString()}</span>
            {wallet.reservedBalance > 0 && <span>Reserved: {wallet.reservedBalance.toLocaleString()}</span>}
          </div>
        </div>

        {wallet.publicKey && (
          <div className="bg-muted p-2 rounded text-xs">
            <p className="text-muted-foreground mb-1">Public Key:</p>
            <p className="font-mono break-all">{wallet.publicKey}</p>
          </div>
        )}

        <div className="grid grid-cols-2 gap-2">
          <Button size="sm" onClick={() => router.push("/deposit")} className="h-9">
            <ArrowDownLeft className="w-4 h-4 mr-1" />
            Deposit
          </Button>
          <Button size="sm" variant="outline" onClick={() => router.push("/withdraw")} className="h-9">
            <ArrowUpRight className="w-4 h-4 mr-1" />
            Withdraw
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
