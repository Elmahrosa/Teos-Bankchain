"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/contexts/auth-context"
import { Header } from "@/components/header"
import { BottomNav } from "@/components/bottom-nav"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ArrowUpRight, ArrowDownLeft, Clock, CheckCircle2, XCircle, Loader2 } from "lucide-react"
import { WalletService, type Transaction } from "@/lib/wallet-types"

export default function TransactionsPage() {
  const { isAuthenticated, isLoading, user } = useAuth()
  const router = useRouter()
  const [transactions, setTransactions] = useState<Transaction[]>([])

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push("/login")
      return
    }

    if (user?.walletId) {
      const txns = WalletService.getTransactions(user.walletId)
      setTransactions(txns)
    }
  }, [isAuthenticated, isLoading, router, user])

  if (isLoading || !isAuthenticated) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
      </div>
    )
  }

  const getStatusIcon = (status: Transaction["status"]) => {
    switch (status) {
      case "completed":
        return <CheckCircle2 className="w-4 h-4 text-green-600" />
      case "rejected":
      case "failed":
        return <XCircle className="w-4 h-4 text-destructive" />
      case "processing":
        return <Loader2 className="w-4 h-4 text-primary animate-spin" />
      default:
        return <Clock className="w-4 h-4 text-yellow-600" />
    }
  }

  const getStatusColor = (status: Transaction["status"]) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
      case "rejected":
      case "failed":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300"
      case "processing":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300"
      default:
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300"
    }
  }

  return (
    <div className="min-h-screen bg-background pb-20">
      <Header />
      <main className="px-4 pt-4 pb-6 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Transactions</h1>
            <p className="text-sm text-muted-foreground">View all your transactions</p>
          </div>
        </div>

        {transactions.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <p className="text-muted-foreground">No transactions yet</p>
              <Button onClick={() => router.push("/deposit")} className="mt-4">
                Make a Deposit
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-3">
            {transactions.map((txn) => (
              <Card key={txn.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-3 flex-1">
                      <div
                        className={`w-10 h-10 rounded-full flex items-center justify-center ${
                          txn.type === "deposit" ? "bg-green-100 dark:bg-green-900" : "bg-orange-100 dark:bg-orange-900"
                        }`}
                      >
                        {txn.type === "deposit" ? (
                          <ArrowDownLeft className="w-5 h-5 text-green-600 dark:text-green-400" />
                        ) : (
                          <ArrowUpRight className="w-5 h-5 text-orange-600 dark:text-orange-400" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <h3 className="font-semibold text-sm capitalize">{txn.type.replace("_", " ")}</h3>
                          {getStatusIcon(txn.status)}
                        </div>
                        <p className="text-xs text-muted-foreground mt-0.5">{txn.metadata.description}</p>
                        <div className="flex items-center gap-2 mt-2">
                          <Badge variant="outline" className={`text-xs ${getStatusColor(txn.status)}`}>
                            {txn.status}
                          </Badge>
                          {txn.approvalTier !== "auto" && (
                            <Badge variant="secondary" className="text-xs">
                              {txn.approvalTier.replace("_", " ")}
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className={`font-bold ${txn.type === "deposit" ? "text-green-600" : "text-orange-600"}`}>
                        {txn.type === "deposit" ? "+" : "-"}
                        {txn.amount.toLocaleString()} {txn.currency.toUpperCase()}
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {new Date(txn.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </main>
      <BottomNav />
    </div>
  )
}
