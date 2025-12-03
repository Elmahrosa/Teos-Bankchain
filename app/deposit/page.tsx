"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/contexts/auth-context"
import { Header } from "@/components/header"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Info } from "lucide-react"
import { WalletService, determineApprovalTier, APPROVAL_THRESHOLDS } from "@/lib/wallet-types"
import { useToast } from "@/hooks/use-toast"

export default function DepositPage() {
  const { user } = useAuth()
  const router = useRouter()
  const { toast } = useToast()
  const [amount, setAmount] = useState("")
  const [currency, setCurrency] = useState<"egp" | "pi" | "usd">("egp")
  const [method, setMethod] = useState("bank_transfer")
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user?.walletId) return

    setIsSubmitting(true)

    try {
      const numAmount = Number.parseFloat(amount)
      const tier = determineApprovalTier(numAmount)

      const transaction = WalletService.createTransaction(user.walletId, "deposit", numAmount, currency, {
        description: `${method.replace("_", " ")} deposit`,
        reference: `DEP${Date.now()}`,
      })

      toast({
        title: "Deposit Initiated",
        description:
          tier === "auto"
            ? "Your deposit has been approved and is processing."
            : `Your deposit requires ${tier.replace("_", " ")} approval.`,
      })

      setTimeout(() => {
        router.push("/transactions")
      }, 1500)
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to process deposit. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const numAmount = Number.parseFloat(amount) || 0
  const tier = determineApprovalTier(numAmount)

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="px-4 pt-4 pb-6 space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => router.back()}>
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold">Deposit Funds</h1>
            <p className="text-sm text-muted-foreground">Add funds to your wallet</p>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Deposit Information</CardTitle>
            <CardDescription>Enter the amount and select your deposit method</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="amount">Amount</Label>
                <Input
                  id="amount"
                  type="number"
                  step="0.01"
                  min="0"
                  placeholder="Enter amount"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="currency">Currency</Label>
                <Select value={currency} onValueChange={(v: any) => setCurrency(v)}>
                  <SelectTrigger id="currency">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="egp">Egyptian Pound (EGP)</SelectItem>
                    <SelectItem value="usd">US Dollar (USD)</SelectItem>
                    <SelectItem value="pi">Pi Network (π)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="method">Deposit Method</Label>
                <Select value={method} onValueChange={setMethod}>
                  <SelectTrigger id="method">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="bank_transfer">Bank Transfer</SelectItem>
                    <SelectItem value="agent">Cash via Agent</SelectItem>
                    <SelectItem value="card">Debit Card</SelectItem>
                    <SelectItem value="pi_wallet">Pi Wallet Bridge</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {numAmount > 0 && (
                <Alert>
                  <Info className="h-4 w-4" />
                  <AlertDescription className="flex items-center justify-between">
                    <span className="text-sm">
                      Approval Tier:{" "}
                      <Badge variant="outline" className="ml-1">
                        {tier.replace("_", " ")}
                      </Badge>
                    </span>
                  </AlertDescription>
                </Alert>
              )}

              <Button type="submit" className="w-full" disabled={isSubmitting || !amount}>
                {isSubmitting ? "Processing..." : "Submit Deposit"}
              </Button>
            </form>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Approval Tiers</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-xs">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Auto-approved:</span>
              <span className="font-medium">0 - {APPROVAL_THRESHOLDS.tier_1.toLocaleString()} EGP</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Tier 1 (Operations):</span>
              <span className="font-medium">
                {APPROVAL_THRESHOLDS.tier_1.toLocaleString()} - {APPROVAL_THRESHOLDS.tier_2.toLocaleString()} EGP
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Tier 2 (Ops + Compliance):</span>
              <span className="font-medium">
                {APPROVAL_THRESHOLDS.tier_2.toLocaleString()} - {APPROVAL_THRESHOLDS.tier_3.toLocaleString()} EGP
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Tier 3 (Full approval):</span>
              <span className="font-medium">{APPROVAL_THRESHOLDS.tier_3.toLocaleString()}+ EGP</span>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
