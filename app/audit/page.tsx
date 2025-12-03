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
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Download, FileText, AlertCircle, Activity, Shield } from "lucide-react"
import { AuditService, type AuditLog, type AuditEventType } from "@/lib/audit"

export default function AuditPage() {
  const { isAuthenticated, isLoading, user, hasPermission } = useAuth()
  const router = useRouter()
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([])
  const [filteredLogs, setFilteredLogs] = useState<AuditLog[]>([])
  const [filterEventType, setFilterEventType] = useState<string>("all")
  const [filterDateRange, setFilterDateRange] = useState<string>("7days")
  const [metrics, setMetrics] = useState({
    totalEvents: 0,
    suspiciousActivities: 0,
    configChanges: 0,
    approvals: 0,
  })

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push("/login")
      return
    }

    if (!hasPermission("view_audit_logs")) {
      router.push("/dashboard")
      return
    }

    loadAuditData()
  }, [isAuthenticated, isLoading, router, hasPermission])

  const loadAuditData = async () => {
    const logs = await AuditService.getAuditLogs()
    setAuditLogs(logs)
    setFilteredLogs(logs)

    // Calculate metrics
    setMetrics({
      totalEvents: logs.length,
      suspiciousActivities: logs.filter((l) => l.eventType === "suspicious_activity").length,
      configChanges: logs.filter((l) => l.eventType === "config_changed").length,
      approvals: logs.filter((l) => l.eventType === "transaction_approved").length,
    })
  }

  useEffect(() => {
    let filtered = [...auditLogs]

    // Filter by event type
    if (filterEventType !== "all") {
      filtered = filtered.filter((log) => log.eventType === filterEventType)
    }

    // Filter by date range
    const now = new Date()
    const rangeDate = new Date()
    switch (filterDateRange) {
      case "24hours":
        rangeDate.setHours(rangeDate.getHours() - 24)
        break
      case "7days":
        rangeDate.setDate(rangeDate.getDate() - 7)
        break
      case "30days":
        rangeDate.setDate(rangeDate.getDate() - 30)
        break
    }
    filtered = filtered.filter((log) => log.timestamp >= rangeDate)

    setFilteredLogs(filtered)
  }, [filterEventType, filterDateRange, auditLogs])

  const handleExport = async (format: "csv" | "json") => {
    try {
      const blob = await AuditService.exportAuditLogs(format, {
        eventType: filterEventType !== "all" ? (filterEventType as AuditEventType) : undefined,
      })

      const url = URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = `audit-logs-${Date.now()}.${format}`
      a.click()
      URL.revokeObjectURL(url)
    } catch (error) {
      console.error("[v0] Export error:", error)
    }
  }

  const handleGenerateRegulatorReport = async () => {
    try {
      const startDate = new Date()
      startDate.setDate(startDate.getDate() - 30)
      const endDate = new Date()

      const report = await AuditService.generateRegulatorReport(startDate, endDate)
      console.log("[v0] Regulator report generated:", report)
      alert("Regulator report generated successfully (mock)")
    } catch (error) {
      console.error("[v0] Report generation error:", error)
    }
  }

  if (isLoading || !isAuthenticated) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
      </div>
    )
  }

  const getEventIcon = (eventType: AuditEventType) => {
    switch (eventType) {
      case "suspicious_activity":
        return <AlertCircle className="w-4 h-4 text-destructive" />
      case "config_changed":
        return <Shield className="w-4 h-4 text-yellow-600" />
      case "transaction_approved":
      case "transaction_created":
        return <Activity className="w-4 h-4 text-green-600" />
      default:
        return <FileText className="w-4 h-4 text-muted-foreground" />
    }
  }

  return (
    <div className="min-h-screen bg-background pb-20">
      <Header />
      <main className="px-4 pt-4 pb-6 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Audit & Observability</h1>
            <p className="text-sm text-muted-foreground">System logs, metrics & compliance reports</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <Activity className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{metrics.totalEvents}</p>
                  <p className="text-xs text-muted-foreground">Total Events</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-red-500/10 flex items-center justify-center">
                  <AlertCircle className="w-5 h-5 text-red-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{metrics.suspiciousActivities}</p>
                  <p className="text-xs text-muted-foreground">Suspicious</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="logs" className="space-y-4">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="logs">Audit Logs</TabsTrigger>
            <TabsTrigger value="metrics">Metrics</TabsTrigger>
            <TabsTrigger value="reports">Reports</TabsTrigger>
          </TabsList>

          <TabsContent value="logs" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Filters</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-2">
                    <Label className="text-xs">Event Type</Label>
                    <Select value={filterEventType} onValueChange={setFilterEventType}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Events</SelectItem>
                        <SelectItem value="user_login">User Login</SelectItem>
                        <SelectItem value="transaction_created">Transaction Created</SelectItem>
                        <SelectItem value="transaction_approved">Transaction Approved</SelectItem>
                        <SelectItem value="suspicious_activity">Suspicious Activity</SelectItem>
                        <SelectItem value="config_changed">Config Changed</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs">Date Range</Label>
                    <Select value={filterDateRange} onValueChange={setFilterDateRange}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="24hours">Last 24 Hours</SelectItem>
                        <SelectItem value="7days">Last 7 Days</SelectItem>
                        <SelectItem value="30days">Last 30 Days</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button size="sm" variant="outline" onClick={() => handleExport("csv")} className="flex-1">
                    <Download className="w-4 h-4 mr-1" />
                    CSV
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => handleExport("json")} className="flex-1">
                    <Download className="w-4 h-4 mr-1" />
                    JSON
                  </Button>
                </div>
              </CardContent>
            </Card>

            <div className="space-y-2">
              {filteredLogs.length === 0 ? (
                <Card>
                  <CardContent className="py-8 text-center">
                    <p className="text-sm text-muted-foreground">No audit logs found</p>
                  </CardContent>
                </Card>
              ) : (
                filteredLogs.map((log) => (
                  <Card key={log.id} className="hover:shadow-sm transition-shadow">
                    <CardContent className="p-3">
                      <div className="flex items-start gap-3">
                        <div className="mt-0.5">{getEventIcon(log.eventType)}</div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2">
                            <div className="flex-1">
                              <h4 className="text-sm font-medium capitalize">{log.eventType.replace(/_/g, " ")}</h4>
                              <p className="text-xs text-muted-foreground mt-0.5">{log.action}</p>
                            </div>
                            <span className="text-xs text-muted-foreground whitespace-nowrap">
                              {log.timestamp.toLocaleTimeString()}
                            </span>
                          </div>
                          <div className="flex items-center gap-2 mt-2">
                            <Badge variant="secondary" className="text-xs">
                              {log.userEmail}
                            </Badge>
                            <Badge variant="outline" className="text-xs capitalize">
                              {log.userRole.replace(/_/g, " ")}
                            </Badge>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </TabsContent>

          <TabsContent value="metrics" className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">Config Changes</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-3xl font-bold">{metrics.configChanges}</p>
                  <p className="text-xs text-muted-foreground mt-1">Last 7 days</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">Approvals</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-3xl font-bold">{metrics.approvals}</p>
                  <p className="text-xs text-muted-foreground mt-1">Last 7 days</p>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle className="text-base">System Health</CardTitle>
                <CardDescription>Real-time monitoring metrics</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">API Response Time</span>
                    <span className="font-medium">125ms</span>
                  </div>
                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <div className="h-full bg-green-500 w-[85%]" />
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Database Queries</span>
                    <span className="font-medium">1,247/min</span>
                  </div>
                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <div className="h-full bg-blue-500 w-[65%]" />
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Error Rate</span>
                    <span className="font-medium">0.02%</span>
                  </div>
                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <div className="h-full bg-green-500 w-[2%]" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="reports" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Regulator Reports</CardTitle>
                <CardDescription>Generate compliance reports for regulatory authorities</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label className="text-sm">Report Type</Label>
                  <Select defaultValue="aml">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="aml">AML/CFT Compliance</SelectItem>
                      <SelectItem value="transaction">Transaction Summary</SelectItem>
                      <SelectItem value="user">User Activity Report</SelectItem>
                      <SelectItem value="suspicious">Suspicious Activity Report (SAR)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label className="text-sm">Period</Label>
                  <Select defaultValue="monthly">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="weekly">Last Week</SelectItem>
                      <SelectItem value="monthly">Last Month</SelectItem>
                      <SelectItem value="quarterly">Last Quarter</SelectItem>
                      <SelectItem value="yearly">Last Year</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <Button className="w-full" onClick={handleGenerateRegulatorReport}>
                  <FileText className="w-4 h-4 mr-2" />
                  Generate Report
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base">Recent Reports</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex items-center justify-between p-2 border rounded">
                  <div>
                    <p className="text-sm font-medium">AML Report - November 2024</p>
                    <p className="text-xs text-muted-foreground">Generated 2 days ago</p>
                  </div>
                  <Button size="sm" variant="ghost">
                    <Download className="w-4 h-4" />
                  </Button>
                </div>
                <div className="flex items-center justify-between p-2 border rounded">
                  <div>
                    <p className="text-sm font-medium">Transaction Summary - Q4 2024</p>
                    <p className="text-xs text-muted-foreground">Generated 5 days ago</p>
                  </div>
                  <Button size="sm" variant="ghost">
                    <Download className="w-4 h-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card className="border-primary/50 bg-primary/5">
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  <Shield className="w-5 h-5 text-primary mt-0.5" />
                  <div>
                    <h4 className="font-semibold text-sm">Compliance Ready</h4>
                    <p className="text-xs text-muted-foreground mt-1">
                      All reports are formatted according to Central Bank of Egypt (CBE) requirements and include
                      digital signatures for authenticity.
                    </p>
                  </div>
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
