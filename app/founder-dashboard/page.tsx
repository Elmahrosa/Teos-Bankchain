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
import { RBACService } from "@/shared/auth/rbac"
import { DashboardExportService } from "@/lib/dashboard-export"
import { NotificationService } from "@/lib/notifications"
import {
  Users,
  DollarSign,
  Activity,
  Globe,
  Shield,
  Zap,
  ArrowUpRight,
  Download,
  Bell,
  Languages,
  AlertTriangle,
} from "lucide-react"

export default function FounderDashboardPage() {
  const { isAuthenticated, isLoading, user } = useAuth()
  const router = useRouter()
  const [language, setLanguage] = useState<"en" | "ar">("en")
  const [notifications, setNotifications] = useState(NotificationService.getNotifications())
  const [unreadCount, setUnreadCount] = useState(NotificationService.getUnreadCount())

  const [metrics, setMetrics] = useState({
    totalUsers: 12847,
    activeUsers: 8921,
    totalTransactions: 45230,
    transactionVolume: 8945230,
    revenue: 234567,
    growth: 23.5,
    compliance: 99.8,
    uptime: 99.99,
  })

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push("/login")
    }
  }, [isAuthenticated, isLoading, router])

  useEffect(() => {
    if (user && !RBACService.canAccessAdminDashboard(user.role)) {
      router.push("/client-dashboard")
    }
  }, [user, router])

  useEffect(() => {
    const unsubscribe = NotificationService.subscribe((notifs) => {
      setNotifications(notifs)
      setUnreadCount(NotificationService.getUnreadCount())
    })

    const healthCheck = setInterval(() => {
      const random = Math.random()
      if (random > 0.95) {
        NotificationService.notifySystemHealth("API latency increased to 250ms", "medium")
      }
    }, 30000)

    return () => {
      unsubscribe()
      clearInterval(healthCheck)
    }
  }, [])

  const handleExportCSV = () => {
    if (!user || !RBACService.hasPermission(user.role, "analytics", "read")) {
      alert("You don't have permission to export data")
      return
    }

    const exportData = [
      { metric: "Total Users", value: metrics.totalUsers, growth: `${metrics.growth}%` },
      { metric: "Transaction Volume", value: metrics.transactionVolume, growth: "+18.2%" },
      { metric: "Revenue", value: metrics.revenue, growth: "+12.3%" },
      { metric: "Compliance Score", value: metrics.compliance, growth: "0%" },
      { metric: "System Uptime", value: metrics.uptime, growth: "0%" },
    ]

    DashboardExportService.exportToCSV(exportData, `founder-dashboard-${Date.now()}.csv`)
  }

  const handleExportJSON = () => {
    if (!user || !RBACService.hasPermission(user.role, "analytics", "read")) {
      alert("You don't have permission to export data")
      return
    }

    const exportData = {
      metrics,
      timestamp: new Date().toISOString(),
      generatedFor: "Investor Deck",
    }

    DashboardExportService.exportToJSON(exportData, `founder-dashboard-${Date.now()}.json`)
  }

  const content = {
    en: {
      title: "Founder Dashboard",
      subtitle: "Executive overview and business intelligence",
      totalUsers: "Total Users",
      txVolume: "TX Volume",
      compliance: "Compliance",
      uptime: "System Uptime",
      businessIntelligence: "Business Intelligence",
      revenue: "Revenue",
      users: "Users",
      regions: "Regions",
      platformHealth: "Platform Health",
      exportCSV: "Export CSV",
      exportJSON: "Export JSON",
    },
    ar: {
      title: "لوحة المؤسس",
      subtitle: "نظرة عامة تنفيذية وذكاء الأعمال",
      totalUsers: "إجمالي المستخدمين",
      txVolume: "حجم المعاملات",
      compliance: "الامتثال",
      uptime: "وقت تشغيل النظام",
      businessIntelligence: "ذكاء الأعمال",
      revenue: "الإيرادات",
      users: "المستخدمون",
      regions: "المناطق",
      platformHealth: "صحة المنصة",
      exportCSV: "تصدير CSV",
      exportJSON: "تصدير JSON",
    },
  }

  const t = content[language]

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

  return (
    <div className="min-h-screen bg-background pb-20" dir={language === "ar" ? "rtl" : "ltr"}>
      <Header />
      <main className="px-4 pt-4 pb-6 space-y-6 max-w-7xl mx-auto">
        <div className="flex items-start justify-between gap-4">
          <div className="space-y-1">
            <h1 className="text-2xl font-bold">{t.title}</h1>
            <p className="text-sm text-muted-foreground">{t.subtitle}</p>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="icon"
              onClick={() => setLanguage(language === "en" ? "ar" : "en")}
              title={language === "en" ? "Switch to Arabic" : "Switch to English"}
            >
              <Languages className="w-4 h-4" />
            </Button>

            <Button variant="outline" size="icon" className="relative bg-transparent">
              <Bell className="w-4 h-4" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                  {unreadCount}
                </span>
              )}
            </Button>

            <Button variant="outline" size="sm" onClick={handleExportCSV}>
              <Download className="w-4 h-4 mr-2" />
              {t.exportCSV}
            </Button>
            <Button variant="outline" size="sm" onClick={handleExportJSON}>
              <Download className="w-4 h-4 mr-2" />
              {t.exportJSON}
            </Button>
          </div>
        </div>

        {notifications.filter((n) => n.type === "system_health" && !n.read).length > 0 && (
          <Card className="border-orange-500/50 bg-orange-500/5">
            <CardContent className="pt-4">
              <div className="flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 text-orange-500 mt-0.5" />
                <div className="flex-1">
                  <p className="text-sm font-medium">System Health Alerts</p>
                  <div className="space-y-2 mt-2">
                    {notifications
                      .filter((n) => n.type === "system_health" && !n.read)
                      .slice(0, 3)
                      .map((notif) => (
                        <div key={notif.id} className="text-xs text-muted-foreground flex items-center justify-between">
                          <span>{notif.message}</span>
                          <Button variant="ghost" size="sm" onClick={() => NotificationService.markAsRead(notif.id)}>
                            Dismiss
                          </Button>
                        </div>
                      ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <Card className="border-primary/20 bg-gradient-to-br from-primary/10 to-primary/5">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-muted-foreground">{t.totalUsers}</p>
                  <p className="text-2xl font-bold">{metrics.totalUsers.toLocaleString()}</p>
                  <div className="flex items-center gap-1 mt-1">
                    <ArrowUpRight className="w-3 h-3 text-green-500" />
                    <span className="text-xs text-green-500 font-medium">+{metrics.growth}%</span>
                  </div>
                </div>
                <Users className="w-8 h-8 text-primary" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-accent/20 bg-gradient-to-br from-accent/10 to-accent/5">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-muted-foreground">{t.txVolume}</p>
                  <p className="text-2xl font-bold">${(metrics.transactionVolume / 1000000).toFixed(1)}M</p>
                  <div className="flex items-center gap-1 mt-1">
                    <ArrowUpRight className="w-3 h-3 text-green-500" />
                    <span className="text-xs text-green-500 font-medium">+18.2%</span>
                  </div>
                </div>
                <DollarSign className="w-8 h-8 text-accent" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-green-500/20 bg-gradient-to-br from-green-500/10 to-green-500/5">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-muted-foreground">{t.compliance}</p>
                  <p className="text-2xl font-bold">{metrics.compliance}%</p>
                  <p className="text-xs text-green-500 font-medium mt-1">Excellent</p>
                </div>
                <Shield className="w-8 h-8 text-green-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-blue-500/20 bg-gradient-to-br from-blue-500/10 to-blue-500/5">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-muted-foreground">{t.uptime}</p>
                  <p className="text-2xl font-bold">{metrics.uptime}%</p>
                  <p className="text-xs text-blue-500 font-medium mt-1">On Track</p>
                </div>
                <Zap className="w-8 h-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>{t.businessIntelligence}</CardTitle>
            <CardDescription>Performance metrics and growth indicators</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="revenue" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="revenue">{t.revenue}</TabsTrigger>
                <TabsTrigger value="users">{t.users}</TabsTrigger>
                <TabsTrigger value="regions">{t.regions}</TabsTrigger>
              </TabsList>

              <TabsContent value="revenue" className="space-y-4 mt-4">
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex-1">
                      <p className="text-sm font-medium">Monthly Revenue</p>
                      <p className="text-xs text-muted-foreground">Transaction fees + subscriptions</p>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold">${(metrics.revenue / 1000).toFixed(1)}K</p>
                      <div className="flex items-center gap-1 justify-end">
                        <ArrowUpRight className="w-3 h-3 text-green-500" />
                        <span className="text-xs text-green-500">+12.3%</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex-1">
                      <p className="text-sm font-medium">Average Transaction Fee</p>
                      <p className="text-xs text-muted-foreground">Per transaction</p>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold">$5.18</p>
                      <div className="flex items-center gap-1 justify-end">
                        <ArrowUpRight className="w-3 h-3 text-green-500" />
                        <span className="text-xs text-green-500">+3.2%</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex-1">
                      <p className="text-sm font-medium">MRR Growth</p>
                      <p className="text-xs text-muted-foreground">Monthly recurring revenue</p>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold">+23.5%</p>
                      <Badge variant="secondary" className="mt-1">
                        Target: +20%
                      </Badge>
                    </div>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="users" className="space-y-4 mt-4">
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex-1">
                      <p className="text-sm font-medium">Active Users</p>
                      <p className="text-xs text-muted-foreground">Last 30 days</p>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold">{metrics.activeUsers.toLocaleString()}</p>
                      <p className="text-xs text-muted-foreground">
                        {((metrics.activeUsers / metrics.totalUsers) * 100).toFixed(1)}% of total
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex-1">
                      <p className="text-sm font-medium">User Growth Rate</p>
                      <p className="text-xs text-muted-foreground">Month over month</p>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold">+{metrics.growth}%</p>
                      <div className="flex items-center gap-1 justify-end">
                        <ArrowUpRight className="w-3 h-3 text-green-500" />
                        <span className="text-xs text-green-500">Accelerating</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex-1">
                      <p className="text-sm font-medium">KYC Completion</p>
                      <p className="text-xs text-muted-foreground">Verified users</p>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold">94.2%</p>
                      <Badge variant="secondary" className="mt-1">
                        Excellent
                      </Badge>
                    </div>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="regions" className="space-y-4 mt-4">
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center gap-3 flex-1">
                      <Globe className="w-5 h-5 text-primary" />
                      <div>
                        <p className="text-sm font-medium">Egypt</p>
                        <p className="text-xs text-muted-foreground">Primary market</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-bold">67.3%</p>
                      <p className="text-xs text-muted-foreground">8,642 users</p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center gap-3 flex-1">
                      <Globe className="w-5 h-5 text-accent" />
                      <div>
                        <p className="text-sm font-medium">UAE</p>
                        <p className="text-xs text-muted-foreground">Growing market</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-bold">18.5%</p>
                      <p className="text-xs text-muted-foreground">2,377 users</p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center gap-3 flex-1">
                      <Globe className="w-5 h-5 text-blue-500" />
                      <div>
                        <p className="text-sm font-medium">Saudi Arabia</p>
                        <p className="text-xs text-muted-foreground">Expansion target</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-bold">14.2%</p>
                      <p className="text-xs text-muted-foreground">1,828 users</p>
                    </div>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="w-5 h-5" />
              {t.platformHealth}
            </CardTitle>
            <CardDescription>Real-time system monitoring</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center justify-between p-3 border rounded-lg">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                <div>
                  <p className="text-sm font-medium">API Services</p>
                  <p className="text-xs text-muted-foreground">All systems operational</p>
                </div>
              </div>
              <Badge variant="secondary" className="bg-green-500/10 text-green-500">
                Healthy
              </Badge>
            </div>

            <div className="flex items-center justify-between p-3 border rounded-lg">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                <div>
                  <p className="text-sm font-medium">Database</p>
                  <p className="text-xs text-muted-foreground">Response time: 45ms avg</p>
                </div>
              </div>
              <Badge variant="secondary" className="bg-green-500/10 text-green-500">
                Optimal
              </Badge>
            </div>

            <div className="flex items-center justify-between p-3 border rounded-lg">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                <div>
                  <p className="text-sm font-medium">Compliance Engine</p>
                  <p className="text-xs text-muted-foreground">KYC/AML processing</p>
                </div>
              </div>
              <Badge variant="secondary" className="bg-green-500/10 text-green-500">
                Active
              </Badge>
            </div>

            <div className="flex items-center justify-between p-3 border rounded-lg">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                <div>
                  <p className="text-sm font-medium">Pi Network Integration</p>
                  <p className="text-xs text-muted-foreground">Payment gateway</p>
                </div>
              </div>
              <Badge variant="secondary" className="bg-green-500/10 text-green-500">
                Connected
              </Badge>
            </div>
          </CardContent>
        </Card>
      </main>
      <BottomNav />
    </div>
  )
}
