"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Clock, AlertCircle, CheckCircle, ArrowRightLeft, Activity, Download } from "lucide-react"
import { useAuth } from "@/contexts/auth-context"

interface ReconciliationItem {
  id: string
  date: string
  type: "bank_transfer" | "pi_network" | "agent_network"
  expected: number
  actual: number
  difference: number
  status: "matched" | "discrepancy" | "pending"
  currency: string
}

interface CutoffTime {
  type: string
  time: string
  nextCutoff: string
  status: "open" | "closed" | "approaching"
}

interface FXConversion {
  id: string
  from: string
  to: string
  amount: number
  rate: number
  converted: number
  provider: string
  timestamp: string
  status: "completed" | "pending" | "failed"
}

interface SLAMetric {
  service: string
  uptime: number
  latency: number
  target: number
  status: "healthy" | "degraded" | "critical"
}

export default function TreasuryDashboard() {
  const { user } = useAuth()
  const [reconciliations, setReconciliations] = useState<ReconciliationItem[]>([])
  const [cutoffTimes, setCutoffTimes] = useState<CutoffTime[]>([])
  const [fxConversions, setFXConversions] = useState<FXConversion[]>([])
  const [slaMetrics, setSLAMetrics] = useState<SLAMetric[]>([])
  const [selectedCurrency, setSelectedCurrency] = useState("all")

  useEffect(() => {
    loadTreasuryData()

    // Refresh every 30 seconds
    const interval = setInterval(loadTreasuryData, 30000)
    return () => clearInterval(interval)
  }, [])

  const loadTreasuryData = async () => {
    // Mock data - replace with actual API calls
    setReconciliations([
      {
        id: "1",
        date: "2024-01-15",
        type: "bank_transfer",
        expected: 1500000,
        actual: 1500000,
        difference: 0,
        status: "matched",
        currency: "EGP",
      },
      {
        id: "2",
        date: "2024-01-15",
        type: "pi_network",
        expected: 5000,
        actual: 4950,
        difference: -50,
        status: "discrepancy",
        currency: "PI",
      },
      {
        id: "3",
        date: "2024-01-15",
        type: "agent_network",
        expected: 250000,
        actual: 250000,
        difference: 0,
        status: "matched",
        currency: "EGP",
      },
    ])

    setCutoffTimes([
      {
        type: "Domestic Wire",
        time: "14:00 EET",
        nextCutoff: "2024-01-15T14:00:00Z",
        status: "open",
      },
      {
        type: "International Wire",
        time: "12:00 EET",
        nextCutoff: "2024-01-15T12:00:00Z",
        status: "approaching",
      },
      {
        type: "Pi Network Settlement",
        time: "23:59 UTC",
        nextCutoff: "2024-01-15T23:59:00Z",
        status: "open",
      },
    ])

    setFXConversions([
      {
        id: "1",
        from: "USD",
        to: "EGP",
        amount: 10000,
        rate: 30.85,
        converted: 308500,
        provider: "Central Bank",
        timestamp: "2024-01-15T10:30:00Z",
        status: "completed",
      },
      {
        id: "2",
        from: "PI",
        to: "EGP",
        amount: 1000,
        rate: 950,
        converted: 950000,
        provider: "Pi Network",
        timestamp: "2024-01-15T11:15:00Z",
        status: "completed",
      },
    ])

    setSLAMetrics([
      {
        service: "API Gateway",
        uptime: 99.9,
        latency: 45,
        target: 100,
        status: "healthy",
      },
      {
        service: "Payment Processing",
        uptime: 99.5,
        latency: 120,
        target: 150,
        status: "healthy",
      },
      {
        service: "Compliance Checks",
        uptime: 98.2,
        latency: 890,
        target: 1000,
        status: "degraded",
      },
      {
        service: "Settlement Rails",
        uptime: 99.95,
        latency: 75,
        target: 200,
        status: "healthy",
      },
    ])
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "matched":
      case "completed":
      case "healthy":
      case "open":
        return "text-emerald-600 bg-emerald-50"
      case "discrepancy":
      case "degraded":
      case "approaching":
        return "text-orange-600 bg-orange-50"
      case "pending":
        return "text-blue-600 bg-blue-50"
      case "failed":
      case "critical":
      case "closed":
        return "text-red-600 bg-red-50"
      default:
        return "text-gray-600 bg-gray-50"
    }
  }

  const exportReconciliation = () => {
    const csv = [
      ["Date", "Type", "Expected", "Actual", "Difference", "Status", "Currency"].join(","),
      ...reconciliations.map((r) =>
        [r.date, r.type, r.expected, r.actual, r.difference, r.status, r.currency].join(","),
      ),
    ].join("\n")

    const blob = new Blob([csv], { type: "text/csv" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `reconciliation_${new Date().toISOString().split("T")[0]}.csv`
    a.click()
  }

  // Check if user has access
  if (!["bank_admin", "operations"].includes(user?.role || "")) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Access Denied</CardTitle>
            <CardDescription>You don't have permission to access the Treasury Dashboard</CardDescription>
          </CardHeader>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background p-4 md:p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Treasury Dashboard</h1>
            <p className="text-muted-foreground">Reconciliation, cutoff times, and SLA monitoring</p>
          </div>
          <Button onClick={exportReconciliation} variant="outline" className="gap-2 bg-transparent">
            <Download className="h-4 w-4" />
            Export Report
          </Button>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Reconciled</p>
                  <p className="text-2xl font-bold text-foreground">
                    {reconciliations.filter((r) => r.status === "matched").length}
                  </p>
                </div>
                <CheckCircle className="h-10 w-10 text-emerald-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Discrepancies</p>
                  <p className="text-2xl font-bold text-orange-600">
                    {reconciliations.filter((r) => r.status === "discrepancy").length}
                  </p>
                </div>
                <AlertCircle className="h-10 w-10 text-orange-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Open Cutoffs</p>
                  <p className="text-2xl font-bold text-foreground">
                    {cutoffTimes.filter((c) => c.status === "open").length}
                  </p>
                </div>
                <Clock className="h-10 w-10 text-blue-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Avg Uptime</p>
                  <p className="text-2xl font-bold text-emerald-600">
                    {(slaMetrics.reduce((sum, m) => sum + m.uptime, 0) / slaMetrics.length).toFixed(1)}%
                  </p>
                </div>
                <Activity className="h-10 w-10 text-emerald-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="reconciliation" className="space-y-4">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="reconciliation">Reconciliation</TabsTrigger>
            <TabsTrigger value="cutoffs">Cutoff Times</TabsTrigger>
            <TabsTrigger value="fx">FX Conversion</TabsTrigger>
            <TabsTrigger value="sla">SLA Monitoring</TabsTrigger>
          </TabsList>

          {/* Reconciliation Tab */}
          <TabsContent value="reconciliation" className="space-y-4">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Daily Reconciliation</CardTitle>
                    <CardDescription>Compare expected vs actual settlement amounts</CardDescription>
                  </div>
                  <Select value={selectedCurrency} onValueChange={setSelectedCurrency}>
                    <SelectTrigger className="w-32">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All</SelectItem>
                      <SelectItem value="EGP">EGP</SelectItem>
                      <SelectItem value="USD">USD</SelectItem>
                      <SelectItem value="PI">PI</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {reconciliations
                    .filter((r) => selectedCurrency === "all" || r.currency === selectedCurrency)
                    .map((item) => (
                      <div key={item.id} className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <span className="font-medium capitalize">{item.type.replace("_", " ")}</span>
                            <Badge className={getStatusColor(item.status)}>{item.status}</Badge>
                          </div>
                          <p className="text-sm text-muted-foreground mt-1">{item.date}</p>
                        </div>
                        <div className="flex gap-6 text-right">
                          <div>
                            <p className="text-sm text-muted-foreground">Expected</p>
                            <p className="font-medium">
                              {item.expected.toLocaleString()} {item.currency}
                            </p>
                          </div>
                          <div>
                            <p className="text-sm text-muted-foreground">Actual</p>
                            <p className="font-medium">
                              {item.actual.toLocaleString()} {item.currency}
                            </p>
                          </div>
                          <div>
                            <p className="text-sm text-muted-foreground">Difference</p>
                            <p
                              className={`font-medium ${item.difference !== 0 ? "text-orange-600" : "text-emerald-600"}`}
                            >
                              {item.difference > 0 ? "+" : ""}
                              {item.difference.toLocaleString()} {item.currency}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Cutoff Times Tab */}
          <TabsContent value="cutoffs" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Settlement Cutoff Times</CardTitle>
                <CardDescription>Configured cutoff times for different settlement rails</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {cutoffTimes.map((cutoff, index) => (
                    <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center gap-3">
                        <Clock className="h-5 w-5 text-muted-foreground" />
                        <div>
                          <p className="font-medium">{cutoff.type}</p>
                          <p className="text-sm text-muted-foreground">Cutoff: {cutoff.time}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="text-right">
                          <p className="text-sm font-medium">Next cutoff</p>
                          <p className="text-sm text-muted-foreground">
                            {new Date(cutoff.nextCutoff).toLocaleTimeString()}
                          </p>
                        </div>
                        <Badge className={getStatusColor(cutoff.status)}>{cutoff.status}</Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* FX Conversion Tab */}
          <TabsContent value="fx" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>FX Conversions</CardTitle>
                <CardDescription>Recent currency conversions via configurable providers</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {fxConversions.map((fx) => (
                    <div key={fx.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center gap-3">
                        <ArrowRightLeft className="h-5 w-5 text-muted-foreground" />
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-medium">
                              {fx.from} → {fx.to}
                            </span>
                            <Badge className={getStatusColor(fx.status)}>{fx.status}</Badge>
                          </div>
                          <p className="text-sm text-muted-foreground">
                            Provider: {fx.provider} • Rate: {fx.rate}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">
                          {fx.amount.toLocaleString()} {fx.from}
                        </p>
                        <p className="text-sm text-emerald-600">
                          {fx.converted.toLocaleString()} {fx.to}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* SLA Monitoring Tab */}
          <TabsContent value="sla" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>SLA Monitoring</CardTitle>
                <CardDescription>Service uptime and latency metrics</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {slaMetrics.map((metric, index) => (
                    <div key={index} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="font-medium">{metric.service}</span>
                          <Badge className={getStatusColor(metric.status)}>{metric.status}</Badge>
                        </div>
                        <div className="flex gap-6 text-sm">
                          <div>
                            <span className="text-muted-foreground">Uptime: </span>
                            <span className="font-medium">{metric.uptime}%</span>
                          </div>
                          <div>
                            <span className="text-muted-foreground">Latency: </span>
                            <span className="font-medium">{metric.latency}ms</span>
                          </div>
                        </div>
                      </div>
                      <div className="space-y-1">
                        <div className="flex justify-between text-xs text-muted-foreground">
                          <span>Performance</span>
                          <span>
                            {metric.latency}/{metric.target}ms target
                          </span>
                        </div>
                        <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                          <div
                            className={`h-full ${
                              metric.status === "healthy"
                                ? "bg-emerald-600"
                                : metric.status === "degraded"
                                  ? "bg-orange-600"
                                  : "bg-red-600"
                            }`}
                            style={{ width: `${Math.min((metric.latency / metric.target) * 100, 100)}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
