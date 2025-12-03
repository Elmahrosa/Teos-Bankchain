"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/contexts/auth-context"
import { Header } from "@/components/header"
import { BottomNav } from "@/components/bottom-nav"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { AlertTriangle, Activity, TrendingUp, Shield, Download, Clock, CheckCircle2, XCircle } from "lucide-react"
import { ComplianceService, type ComplianceAlert, type TransactionMonitor } from "@/lib/compliance"
import { ContactBadge } from "@/components/contact-badge"

export default function DashboardPage() {
  const { isAuthenticated, isLoading, user } = useAuth()
  const router = useRouter()

  const [alerts, setAlerts] = useState<ComplianceAlert[]>([])
  const [transactions, setTransactions] = useState<TransactionMonitor[]>([])
  const [isLoadingData, setIsLoadingData] = useState(true)

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push("/login")
    }
  }, [isAuthenticated, isLoading, router])

  useEffect(() => {
    if (user) {
      // Redirect individual and business users to client dashboard
      if (user.role === "individual" || user.role === "business") {
        router.push("/client-dashboard")
        return
      }
      // Bank admins can access this page but may prefer founder dashboard
      // They can navigate between both via the bottom nav
    }
  }, [user, router])

  useEffect(() => {
    const loadComplianceData = async () => {
      if (isAuthenticated && user) {
        setIsLoadingData(true)
        try {
          const [alertsData, transactionsData] = await Promise.all([
            ComplianceService.getComplianceAlerts(),
            ComplianceService.monitorTransactions(),
          ])
          setAlerts(alertsData)
          setTransactions(transactionsData)
        } catch (error) {
          console.error("[v0] Error loading compliance data:", error)
        } finally {
          setIsLoadingData(false)
        }
      }
    }

    loadComplianceData()
    const interval = setInterval(loadComplianceData, 30000)
    return () => clearInterval(interval)
  }, [isAuthenticated, user])

  const handleExportAudit = async (format: "csv" | "json") => {
    try {
      const blob = await ComplianceService.exportAuditLogs({
        format,
        dateFrom: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
        dateTo: new Date(),
        includeMetadata: true,
      })

      const url = URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = `audit_log_${new Date().toISOString().split("T")[0]}.${format}`
      a.click()
      URL.revokeObjectURL(url)
    } catch (error) {
      console.error("[v0] Error exporting audit logs:", error)
    }
  }

  if (isLoading || !isAuthenticated) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full mx-auto" />
          <p className="text-sm text-muted-foreground">Loading...</p>
        </div>
      </div>
    )
  }

  const openAlerts = alerts.filter((a) => a.status === "open").length
  const criticalAlerts = alerts.filter((a) => a.severity === "critical").length
  const pendingTx = transactions.filter((t) => t.status === "pending" || t.status === "flagged").length
  const highRiskTx = transactions.filter((t) => t.riskScore > 70).length

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "critical":
        return "bg-red-500"
      case "high":
        return "bg-orange-500"
      case "medium":
        return "bg-yellow-500"
      default:
        return "bg-blue-500"
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "open":
        return "destructive"
      case "investigating":
        return "default"
      case "resolved":
        return "secondary"
      default:
        return "outline"
    }
  }

  return (
    <div className="min-h-screen bg-background pb-20">
      <Header />
      <main className="px-4 pt-4 pb-6 space-y-6">
        <div className="space-y-1">
          <h1 className="text-2xl font-bold">Welcome, {user?.name}</h1>
          <p className="text-sm text-muted-foreground capitalize">{user?.role?.replace("_", " ")}</p>
        </div>

        {(user?.role === "bank_admin" || user?.role === "compliance_officer" || user?.role === "operations") && (
          <div className="grid grid-cols-2 gap-3">
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-muted-foreground">Open Alerts</p>
                    <p className="text-2xl font-bold">{openAlerts}</p>
                  </div>
                  <AlertTriangle className="w-8 h-8 text-orange-500" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-muted-foreground">Critical</p>
                    <p className="text-2xl font-bold text-red-500">{criticalAlerts}</p>
                  </div>
                  <Shield className="w-8 h-8 text-red-500" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-muted-foreground">Pending TX</p>
                    <p className="text-2xl font-bold">{pendingTx}</p>
                  </div>
                  <Clock className="w-8 h-8 text-blue-500" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-muted-foreground">High Risk</p>
                    <p className="text-2xl font-bold text-orange-500">{highRiskTx}</p>
                  </div>
                  <Activity className="w-8 h-8 text-orange-500" />
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {(user?.role === "bank_admin" || user?.role === "compliance_officer" || user?.role === "operations") && (
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Compliance Monitoring</CardTitle>
                  <CardDescription>Real-time alerts and transaction monitoring</CardDescription>
                </div>
                <Badge variant="outline" className="animate-pulse">
                  <Activity className="w-3 h-3 mr-1" />
                  Live
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="alerts" className="w-full">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="alerts">
                    Alerts
                    {openAlerts > 0 && (
                      <Badge variant="destructive" className="ml-2 h-5 w-5 rounded-full p-0 text-xs">
                        {openAlerts}
                      </Badge>
                    )}
                  </TabsTrigger>
                  <TabsTrigger value="monitoring">
                    Monitoring
                    {pendingTx > 0 && (
                      <Badge variant="secondary" className="ml-2 h-5 w-5 rounded-full p-0 text-xs">
                        {pendingTx}
                      </Badge>
                    )}
                  </TabsTrigger>
                  <TabsTrigger value="audit">Export</TabsTrigger>
                </TabsList>

                <TabsContent value="alerts" className="space-y-3 mt-4">
                  {isLoadingData ? (
                    <div className="text-center py-8 text-sm text-muted-foreground">Loading alerts...</div>
                  ) : alerts.length === 0 ? (
                    <div className="text-center py-8 text-sm text-muted-foreground">No alerts</div>
                  ) : (
                    alerts.slice(0, 5).map((alert) => (
                      <div key={alert.id} className="border rounded-lg p-3 space-y-2">
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <div className={`w-2 h-2 rounded-full ${getSeverityColor(alert.severity)}`} />
                              <p className="font-medium text-sm truncate">{alert.title}</p>
                            </div>
                            <p className="text-xs text-muted-foreground">{alert.description}</p>
                            <div className="flex items-center gap-2 mt-2 text-xs text-muted-foreground">
                              <span>{new Date(alert.timestamp).toLocaleTimeString()}</span>
                              {alert.transactionId && <span>• {alert.transactionId}</span>}
                            </div>
                          </div>
                          <Badge variant={getStatusColor(alert.status)} className="shrink-0">
                            {alert.status}
                          </Badge>
                        </div>
                      </div>
                    ))
                  )}
                  {alerts.length > 5 && (
                    <Button
                      variant="outline"
                      className="w-full bg-transparent"
                      onClick={() => router.push("/admin/compliance")}
                    >
                      View All Alerts
                    </Button>
                  )}
                </TabsContent>

                <TabsContent value="monitoring" className="space-y-3 mt-4">
                  {isLoadingData ? (
                    <div className="text-center py-8 text-sm text-muted-foreground">Loading transactions...</div>
                  ) : transactions.length === 0 ? (
                    <div className="text-center py-8 text-sm text-muted-foreground">No transactions</div>
                  ) : (
                    transactions.map((tx) => (
                      <div key={tx.id} className="border rounded-lg p-3 space-y-2">
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <p className="font-medium text-sm">{tx.type.toUpperCase()}</p>
                              <Badge variant="outline" className="text-xs">
                                Risk: {tx.riskScore}%
                              </Badge>
                            </div>
                            <p className="text-xs text-muted-foreground">
                              {tx.amount.toLocaleString()} {tx.currency}
                            </p>
                            <p className="text-xs text-muted-foreground mt-1">
                              {tx.from} → {tx.to}
                            </p>
                            {tx.flags.length > 0 && (
                              <div className="flex gap-1 mt-2">
                                {tx.flags.map((flag) => (
                                  <Badge key={flag} variant="secondary" className="text-xs">
                                    {flag}
                                  </Badge>
                                ))}
                              </div>
                            )}
                          </div>
                          <div className="shrink-0">
                            {tx.status === "completed" ? (
                              <CheckCircle2 className="w-5 h-5 text-green-500" />
                            ) : tx.status === "flagged" ? (
                              <XCircle className="w-5 h-5 text-red-500" />
                            ) : (
                              <Clock className="w-5 h-5 text-orange-500" />
                            )}
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </TabsContent>

                <TabsContent value="audit" className="space-y-3 mt-4">
                  <div className="text-sm text-muted-foreground mb-4">
                    Export audit logs for regulatory compliance and reporting.
                  </div>
                  <div className="space-y-2">
                    <Button
                      variant="outline"
                      className="w-full justify-start bg-transparent"
                      onClick={() => handleExportAudit("csv")}
                    >
                      <Download className="w-4 h-4 mr-2" />
                      Export as CSV
                    </Button>
                    <Button
                      variant="outline"
                      className="w-full justify-start bg-transparent"
                      onClick={() => handleExportAudit("json")}
                    >
                      <Download className="w-4 h-4 mr-2" />
                      Export as JSON
                    </Button>
                  </div>
                  <div className="mt-4 p-3 bg-muted/50 rounded-lg">
                    <p className="text-xs text-muted-foreground">
                      Last 30 days • Includes user actions, transactions, and system events
                    </p>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        )}

        <div className="grid grid-cols-2 gap-3">
          <Button
            variant="outline"
            className="h-24 flex-col gap-2 bg-transparent"
            onClick={() => router.push("/wallets")}
          >
            <TrendingUp className="w-6 h-6" />
            <span className="text-xs">Wallets</span>
          </Button>
          <Button
            variant="outline"
            className="h-24 flex-col gap-2 bg-transparent"
            onClick={() => router.push("/transactions")}
          >
            <Activity className="w-6 h-6" />
            <span className="text-xs">Transactions</span>
          </Button>
        </div>

        <Card className="border-primary/20 bg-gradient-to-br from-primary/5 to-accent/5">
          <CardContent className="py-4">
            <ContactBadge variant="full" />
          </CardContent>
        </Card>
      </main>
      <BottomNav />
    </div>
  )
}
