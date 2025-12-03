"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { apiClient } from "@/lib/api-client"
import { AlertCircle, CheckCircle, Clock, Users, AlertTriangle } from "lucide-react"
import { useAuth } from "@/contexts/auth-context"

export default function SupportAnalytics() {
  const { user } = useAuth()
  const [analytics, setAnalytics] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadAnalytics()
  }, [])

  const loadAnalytics = async () => {
    try {
      const data = await apiClient.get("/support/analytics/dashboard")
      setAnalytics(data)
    } catch (error) {
      console.error("Failed to load analytics:", error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading analytics...</p>
        </div>
      </div>
    )
  }

  const sla = analytics?.sla_metrics || {}
  const volume = analytics?.ticket_volume || {}
  const issues = analytics?.common_issues || []
  const teams = analytics?.team_performance || []

  return (
    <div className="container mx-auto p-4 space-y-6 max-w-7xl">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Support Analytics</h1>
          <p className="text-muted-foreground">Real-time support metrics and SLA tracking</p>
        </div>
        <Badge variant={sla.compliance_rate >= 95 ? "default" : "destructive"} className="text-lg px-4 py-2">
          SLA: {sla.compliance_rate?.toFixed(1)}%
        </Badge>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Tickets</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{volume.month || 0}</div>
            <p className="text-xs text-muted-foreground">+{volume.week || 0} this week</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Open Tickets</CardTitle>
            <AlertCircle className="h-4 w-4 text-amber-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{volume.open || 0}</div>
            <p className="text-xs text-muted-foreground">{volume.in_progress || 0} in progress</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Escalated</CardTitle>
            <AlertTriangle className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{volume.escalated || 0}</div>
            <p className="text-xs text-muted-foreground">Requires attention</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Response</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{sla.avg_response_time || 0}m</div>
            <p className="text-xs text-muted-foreground">Target: 60m</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="issues">Common Issues</TabsTrigger>
          <TabsTrigger value="teams">Team Performance</TabsTrigger>
          <TabsTrigger value="sla">SLA Tracking</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Ticket Volume Trends</CardTitle>
              <CardDescription>Daily ticket creation and resolution rates</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-64 flex items-center justify-center text-muted-foreground">
                Chart visualization would go here (integrate with Recharts)
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="issues" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Top Issues</CardTitle>
              <CardDescription>Most common support categories this month</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {issues.map((issue: any, index: number) => (
                  <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex-1">
                      <div className="font-medium">{issue.category}</div>
                      <div className="text-sm text-muted-foreground">{issue.count} tickets</div>
                    </div>
                    <div className="text-right">
                      <Badge variant="outline">{issue.avg_resolution}</Badge>
                      <div className="text-xs text-muted-foreground mt-1">avg resolution</div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="teams" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Team Performance</CardTitle>
              <CardDescription>Performance metrics by support team</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {teams.map((team: any, index: number) => (
                  <div key={index} className="p-4 border rounded-lg">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="font-semibold text-lg">{team.team}</h3>
                      <Badge variant="default" className="bg-amber-500">
                        ⭐ {team.satisfaction}/5
                      </Badge>
                    </div>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <div className="text-muted-foreground">Tickets Handled</div>
                        <div className="font-semibold text-lg">{team.tickets}</div>
                      </div>
                      <div>
                        <div className="text-muted-foreground">Avg Resolution Time</div>
                        <div className="font-semibold text-lg">{team.avg_time}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="sla" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>SLA Compliance</CardTitle>
                <CardDescription>Current month performance</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Compliant</span>
                    <Badge variant="default" className="bg-green-500">
                      <CheckCircle className="w-3 h-3 mr-1" />
                      {sla.sla_compliant || 0} tickets
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Breached</span>
                    <Badge variant="destructive">
                      <AlertCircle className="w-3 h-3 mr-1" />
                      {sla.sla_breached || 0} tickets
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Escalated</span>
                    <Badge variant="outline">
                      <AlertTriangle className="w-3 h-3 mr-1" />
                      {sla.escalated || 0} tickets
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Response Times</CardTitle>
                <CardDescription>Average response by priority</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">P0 Critical</span>
                    <span className="text-sm font-semibold">12m / 15m target</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">P1 High</span>
                    <span className="text-sm font-semibold">45m / 60m target</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">P2 Medium</span>
                    <span className="text-sm font-semibold">3.2h / 4h target</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">P3 Low</span>
                    <span className="text-sm font-semibold">18h / 24h target</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
