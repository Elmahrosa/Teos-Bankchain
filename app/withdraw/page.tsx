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
import { ArrowLeft, AlertTriangle } from "lucide-react"
import { WalletService, determineApprovalTier } from "@/lib/wallet-types"
import { useToast } from "@/hooks/use-toast"

export default function WithdrawPage() {
  const { user } = useAuth()
  const router = useRouter()
  const { toast } = useToast()
  const [amount, setAmount] = useState("")
  const [currency, setCurrency] = useState<"egp" | "pi" | "usd">("egp")
  const [method, setMethod] = useState("bank_transfer")
  const [accountNumber, setAccountNumber] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user?.walletId) return

    setIsSubmitting(true)

    try {
      const numAmount = Number.parseFloat(amount)
      const tier = determineApprovalTier(numAmount)

      const transaction = WalletService.createTransaction(user.walletId, "withdrawal", numAmount, currency, {
        description: `${method.replace("_", " ")} withdrawal`,
        reference: `WDR${Date.now()}`,
        beneficiary: user.name,
        beneficiaryAccount: accountNumber,
      })

      toast({
        title: "Withdrawal Initiated",
        description:
          tier === "auto"
            ? "Your withdrawal has been approved and is processing."
            : `Your withdrawal requires ${tier.replace("_", " ")} approval.`,
      })

      setTimeout(() => {
        router.push("/transactions")
      }, 1500)
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to process withdrawal. Please try again.",
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
            <h1 className="text-2xl font-bold">Withdraw Funds</h1>
            <p className="text-sm text-muted-foreground">Transfer funds from your wallet</p>
          </div>
        </div>

        <Alert variant="default" className="border-primary/50 bg-primary/5">
          <AlertTriangle className="h-4 w-4 text-primary" />
          <AlertDescription className="text-xs">
            Withdrawals may require approval based on amount. Processing time: 1-3 business days.
          </AlertDescription>
        </Alert>

        <Card>
          <CardHeader>
            <CardTitle>Withdrawal Information</CardTitle>
            <CardDescription>Enter the amount and destination details</CardDescription>
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
                <Label htmlFor="method">Withdrawal Method</Label>
                <Select value={method} onValueChange={setMethod}>
                  <SelectTrigger id="method">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="bank_transfer">Bank Transfer</SelectItem>
                    <SelectItem value="agent">Cash via Agent</SelectItem>
                    <SelectItem value="pi_wallet">Pi Wallet Bridge</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="account">
                  {method === "pi_wallet" ? "Pi Wallet Address" : "Account Number / IBAN"}
                </Label>
                <Input
                  id="account"
                  placeholder={method === "pi_wallet" ? "π address" : "Enter account number"}
                  value={accountNumber}
                  onChange={(e) => setAccountNumber(e.target.value)}
                  required
                />
              </div>

              {numAmount > 0 && (
                <Alert>
                  <AlertDescription className="flex items-center justify-between text-sm">
                    <span>Approval Required:</span>
                    <Badge variant="outline">{tier.replace("_", " ")}</Badge>
                  </AlertDescription>
                </Alert>
              )}

              <Button type="submit" className="w-full" disabled={isSubmitting || !amount || !accountNumber}>
                {isSubmitting ? "Processing..." : "Submit Withdrawal"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
