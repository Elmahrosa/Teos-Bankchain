"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/contexts/auth-context"
import { Header } from "@/components/header"
import { BottomNav } from "@/components/bottom-nav"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { MapPin, Star, TrendingUp, DollarSign } from "lucide-react"
import { SettlementService, type Agent } from "@/lib/settlement-types"

export default function AgentsPage() {
  const { isAuthenticated, isLoading, user, hasPermission } = useAuth()
  const router = useRouter()
  const [agents, setAgents] = useState<Agent[]>([])

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push("/login")
      return
    }

    const allAgents = SettlementService.getAgents()
    setAgents(allAgents)
  }, [isAuthenticated, isLoading, router])

  if (isLoading || !isAuthenticated) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background pb-20">
      <Header />
      <main className="px-4 pt-4 pb-6 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Agent Network</h1>
            <p className="text-sm text-muted-foreground">Cash in/out locations</p>
          </div>
          {hasPermission("manage_agents") && <Button size="sm">Add Agent</Button>}
        </div>

        <div className="space-y-3">
          {agents.map((agent) => (
            <Card key={agent.id} className="hover:shadow-md transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-base">{agent.name}</CardTitle>
                    <div className="flex items-center gap-1 mt-1 text-muted-foreground">
                      <MapPin className="w-3 h-3" />
                      <span className="text-xs">{agent.location}</span>
                    </div>
                  </div>
                  <Badge variant={agent.status === "active" ? "default" : "secondary"} className="capitalize">
                    {agent.status}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <div className="flex items-center gap-2">
                    <Star className="w-4 h-4 text-yellow-500" />
                    <div>
                      <p className="text-xs text-muted-foreground">Rating</p>
                      <p className="font-semibold">{agent.rating.toFixed(1)}/5.0</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <TrendingUp className="w-4 h-4 text-primary" />
                    <div>
                      <p className="text-xs text-muted-foreground">Transactions</p>
                      <p className="font-semibold">{agent.totalTransactions.toLocaleString()}</p>
                    </div>
                  </div>
                </div>
                <div className="flex items-start gap-2 p-3 bg-muted rounded-lg">
                  <DollarSign className="w-4 h-4 text-primary mt-0.5" />
                  <div className="flex-1">
                    <p className="text-xs text-muted-foreground">Available Balance</p>
                    <p className="font-bold text-sm">{agent.availableBalance.toLocaleString()} EGP</p>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      Daily Limit: {agent.dailyLimit.toLocaleString()} EGP
                    </p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button size="sm" variant="outline" className="flex-1 bg-transparent">
                    Cash In
                  </Button>
                  <Button size="sm" variant="outline" className="flex-1 bg-transparent">
                    Cash Out
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </main>
      <BottomNav />
    </div>
  )
}
