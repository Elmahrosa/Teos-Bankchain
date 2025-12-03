"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/contexts/auth-context"
import { Header } from "@/components/header"
import { BottomNav } from "@/components/bottom-nav"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Building2, Users, ArrowRightLeft, CheckCircle2, Clock, XCircle, Coins, Download } from "lucide-react"
import { SettlementService, type Settlement, type LedgerEntry } from "@/lib/settlement"

export default function SettlementPage() {
  const { isAuthenticated, isLoading, user, hasPermission } = useAuth()
  const router = useRouter()
  const [settlements, setSettlements] = useState<Settlement[]>([])
  const [ledgerEntries, setLedgerEntries] = useState<LedgerEntry[]>([])

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push("/login")
      return
    }

    if (!hasPermission("configure_settlement")) {
      router.push("/dashboard")
      return
    }

    loadData()
  }, [isAuthenticated, isLoading, router, hasPermission])

  const loadData = async () => {
    // Mock data - in production, fetch from API
    const mockSettlements: Settlement[] = [
      {
        id: "stl_001",
        transactionId: "txn_001",
        rail: "bank_transfer",
        amount: 50000,
        currency: "EGP",
        status: "completed",
        scheduledDate: new Date(Date.now() - 86400000),
        completedDate: new Date(Date.now() - 3600000),
        reconciliationStatus: "matched",
        reconciliationDate: new Date(),
        metadata: {
          sourceAccount: "ACC001",
          destinationAccount: "ACC002",
          referenceNumber: "BNK2024001",
          bankName: "National Bank of Egypt",
        },
      },
      {
        id: "stl_002",
        transactionId: "txn_002",
        rail: "agent_network",
        amount: 15000,
        currency: "EGP",
        status: "processing",
        scheduledDate: new Date(),
        metadata: {
          agentId: "agent_cairo_01",
        },
      },
      {
        id: "stl_003",
        transactionId: "txn_003",
        rail: "pi_network",
        amount: 250,
        currency: "PI",
        status: "pending",
        scheduledDate: new Date(Date.now() + 86400000),
        metadata: {
          piWalletAddress: "0x742d35Cc6634C0532925a3b844Bc9e7595f0bEbC",
        },
      },
    ]
    setSettlements(mockSettlements)

    const mockLedger = await SettlementService.getLedgerEntries(
      "ACC001",
      new Date(Date.now() - 7 * 86400000),
      new Date(),
    )
    setLedgerEntries(mockLedger)
  }

  const handleExportReconciliation = async () => {
    // Mock export - in production, call actual export API
    console.log("[v0] Exporting reconciliation report")
    alert("Reconciliation report exported (mock)")
  }

  if (isLoading || !isAuthenticated) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
      </div>
    )
  }

  const getStatusIcon = (status: Settlement["status"]) => {
    switch (status) {
      case "completed":
        return <CheckCircle2 className="w-4 h-4 text-green-600" />
      case "failed":
        return <XCircle className="w-4 h-4 text-destructive" />
      default:
        return <Clock className="w-4 h-4 text-yellow-600" />
    }
  }

  const getRailIcon = (rail: Settlement["rail"]) => {
    switch (rail) {
      case "bank_transfer":
        return <Building2 className="w-5 h-5" />
      case "agent_network":
        return <Users className="w-5 h-5" />
      case "pi_network":
        return <Coins className="w-5 h-5" />
      default:
        return <ArrowRightLeft className="w-5 h-5" />
    }
  }

  return (
    <div className="min-h-screen bg-background pb-20">
      <Header />
      <main className="px-4 pt-4 pb-6 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Settlement Rails</h1>
            <p className="text-sm text-muted-foreground">Settlement processing & ledger reconciliation</p>
          </div>
          <Button size="sm" variant="outline" onClick={handleExportReconciliation}>
            <Download className="w-4 h-4 mr-1" />
            Export
          </Button>
        </div>

        <Tabs defaultValue="settlements" className="space-y-4">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="settlements">Settlements</TabsTrigger>
            <TabsTrigger value="config">Configuration</TabsTrigger>
            <TabsTrigger value="ledger">Ledger</TabsTrigger>
          </TabsList>

          <TabsContent value="settlements" className="space-y-4">
            {settlements.length === 0 ? (
              <Card>
                <CardContent className="py-12 text-center">
                  <p className="text-muted-foreground">No settlements to display</p>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-3">
                {settlements.map((settlement) => (
                  <Card key={settlement.id} className="hover:shadow-md transition-shadow">
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex items-start gap-3 flex-1">
                          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                            {getRailIcon(settlement.rail)}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2">
                              <h3 className="font-semibold text-sm capitalize">{settlement.rail.replace("_", " ")}</h3>
                              {getStatusIcon(settlement.status)}
                            </div>
                            <p className="text-xs text-muted-foreground mt-0.5">
                              Scheduled: {settlement.scheduledDate.toLocaleDateString()}
                              {settlement.completedDate &&
                                ` • Completed: ${settlement.completedDate.toLocaleDateString()}`}
                            </p>
                            <div className="flex items-center gap-2 mt-2 flex-wrap">
                              <Badge variant="outline" className="text-xs capitalize">
                                {settlement.status}
                              </Badge>
                              {settlement.reconciliationStatus && (
                                <Badge
                                  variant="secondary"
                                  className={`text-xs ${settlement.reconciliationStatus === "matched" ? "bg-green-500/10 text-green-600" : ""}`}
                                >
                                  {settlement.reconciliationStatus}
                                </Badge>
                              )}
                              {settlement.metadata.referenceNumber && (
                                <span className="text-xs text-muted-foreground">
                                  Ref: {settlement.metadata.referenceNumber}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-bold">
                            {settlement.amount.toLocaleString()} {settlement.currency}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="config" className="space-y-4">
            {Object.entries(SettlementService.CONFIGS).map(([key, config]) => (
              <Card key={key}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-base capitalize">{config.rail.replace("_", " ")}</CardTitle>
                      <CardDescription className="text-xs mt-1">
                        Processing time: {config.processingDays} {config.processingDays === 1 ? "day" : "days"}
                      </CardDescription>
                    </div>
                    <Badge variant="outline" className={config.enabled ? "bg-green-500/10 text-green-600" : ""}>
                      {config.enabled ? "Active" : "Disabled"}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div>
                      <p className="text-xs text-muted-foreground">Cutoff Time</p>
                      <p className="font-medium">{config.cutoffTime}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Processing Days</p>
                      <p className="font-medium">{config.processingDays} days</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Min Amount</p>
                      <p className="font-medium">{config.minAmount.toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Max Amount</p>
                      <p className="font-medium">{config.maxAmount.toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Fee</p>
                      <p className="font-medium">
                        {(config.feePercentage * 100).toFixed(2)}% + {config.flatFee}{" "}
                        {key === "pi_network" ? "PI" : "EGP"}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Can Settle Today</p>
                      <p className="font-medium">{SettlementService.canSettleToday(config.rail) ? "Yes" : "No"}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </TabsContent>

          <TabsContent value="ledger" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Recent Ledger Entries</CardTitle>
                <CardDescription>Transaction ledger for reconciliation</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {ledgerEntries.length === 0 ? (
                    <p className="text-sm text-muted-foreground text-center py-4">No ledger entries</p>
                  ) : (
                    <div className="space-y-2">
                      {ledgerEntries.slice(0, 10).map((entry) => (
                        <div key={entry.id} className="flex items-center justify-between text-sm border-b pb-2">
                          <div className="flex-1">
                            <p className="font-medium">{entry.accountId}</p>
                            <p className="text-xs text-muted-foreground">{entry.description}</p>
                          </div>
                          <div className="text-right">
                            {entry.debitAmount && <p className="text-red-600">-{entry.debitAmount.toLocaleString()}</p>}
                            {entry.creditAmount && (
                              <p className="text-green-600">+{entry.creditAmount.toLocaleString()}</p>
                            )}
                            <p className="text-xs text-muted-foreground">{entry.currency}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
      <BottomNav />
    </div>
  )
}
