"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/contexts/auth-context"
import { Header } from "@/components/header"
import { BottomNav } from "@/components/bottom-nav"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { AlertTriangle, CheckCircle2, XCircle, RefreshCw, Trash2 } from "lucide-react"
import { APIClient, BackendService } from "@/lib/api-client"

export default function MonitoringPage() {
  const { isAuthenticated, isLoading, user } = useAuth()
  const router = useRouter()
  const [failedRequests, setFailedRequests] = useState<any[]>([])
  const [healthStatus, setHealthStatus] = useState<any>(null)
  const [isChecking, setIsChecking] = useState(false)

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push("/login")
      return
    }

    if (user && (user.role === "bank_admin" || user.role === "compliance_officer" || user.role === "operations")) {
      loadMonitoringData()
    }
  }, [isAuthenticated, isLoading, router, user])

  const loadMonitoringData = () => {
    const failures = APIClient.getFailedRequests()
    setFailedRequests(failures)
  }

  const checkHealth = async () => {
    setIsChecking(true)
    try {
      const health = await BackendService.healthCheck()
      setHealthStatus(health)
    } catch (error: any) {
      setHealthStatus({
        status: "unhealthy",
        error: error.message,
        timestamp: new Date().toISOString(),
      })
    } finally {
      setIsChecking(false)
    }
  }

  const clearFailures = () => {
    APIClient.clearFailedRequests()
    setFailedRequests([])
  }

  if (isLoading || !isAuthenticated) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
      </div>
    )
  }

  if (user && user.role !== "bank_admin" && user.role !== "compliance_officer" && user.role !== "operations") {
    return (
      <div className="min-h-screen bg-background pb-20">
        <Header />
        <main className="px-4 pt-4">
          <Card>
            <CardHeader>
              <CardTitle>Access Denied</CardTitle>
              <CardDescription>You don't have permission to view this page.</CardDescription>
            </CardHeader>
          </Card>
        </main>
        <BottomNav />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background pb-20">
      <Header />
      <main className="px-4 pt-4 pb-6 space-y-6">
        <div>
          <h1 className="text-2xl font-bold">API Monitoring</h1>
          <p className="text-sm text-muted-foreground">Backend health and failed request tracking</p>
        </div>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Backend Health</CardTitle>
                <CardDescription>FastAPI service status</CardDescription>
              </div>
              <Button size="sm" onClick={checkHealth} disabled={isChecking}>
                <RefreshCw className={`w-4 h-4 ${isChecking ? "animate-spin" : ""}`} />
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {healthStatus ? (
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  {healthStatus.status === "healthy" ? (
                    <CheckCircle2 className="w-5 h-5 text-green-500" />
                  ) : (
                    <XCircle className="w-5 h-5 text-red-500" />
                  )}
                  <span className="font-semibold capitalize">{healthStatus.status}</span>
                </div>
                <div className="text-xs text-muted-foreground">
                  Last checked: {new Date(healthStatus.timestamp).toLocaleString()}
                </div>
                {healthStatus.error && (
                  <div className="mt-2 p-2 bg-destructive/10 rounded text-xs text-destructive">
                    {healthStatus.error}
                  </div>
                )}
              </div>
            ) : (
              <div className="text-sm text-muted-foreground">Click refresh to check backend health</div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Failed API Calls</CardTitle>
                <CardDescription>Recent errors and network failures</CardDescription>
              </div>
              <div className="flex gap-2">
                <Badge variant={failedRequests.length > 0 ? "destructive" : "secondary"}>{failedRequests.length}</Badge>
                {failedRequests.length > 0 && (
                  <Button size="sm" variant="outline" onClick={clearFailures}>
                    <Trash2 className="w-4 h-4" />
                  </Button>
                )}
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {failedRequests.length === 0 ? (
              <div className="text-center py-8 text-sm text-muted-foreground">No failed requests</div>
            ) : (
              <div className="space-y-3">
                {failedRequests.slice(0, 10).map((request, idx) => (
                  <div key={idx} className="border rounded-lg p-3 space-y-2">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <AlertTriangle className="w-4 h-4 text-red-500" />
                          <p className="font-medium text-sm">
                            {request.method} {request.path}
                          </p>
                        </div>
                        <p className="text-xs text-muted-foreground">{request.error.message}</p>
                        <div className="flex items-center gap-2 mt-2 text-xs text-muted-foreground">
                          <Badge variant="outline" className="text-xs">
                            {request.error.status || "Network"}
                          </Badge>
                          <span>{new Date(request.timestamp).toLocaleString()}</span>
                        </div>
                      </div>
                    </div>
                    {request.error.details && (
                      <div className="mt-2 p-2 bg-muted rounded text-xs font-mono">
                        {JSON.stringify(request.error.details, null, 2)}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Security Features</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-green-500" />
              <span>HTTPS enforcement for all API calls</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-green-500" />
              <span>Request signing with SHA-256 HMAC</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-green-500" />
              <span>API key authentication</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-green-500" />
              <span>30-second request timeout</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-green-500" />
              <span>Automatic error tracking and monitoring</span>
            </div>
          </CardContent>
        </Card>
      </main>
      <BottomNav />
    </div>
  )
}
