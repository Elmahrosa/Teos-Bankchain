"use client"

import { Eye, EyeOff, TrendingUp } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { useState } from "react"

export function AccountBalance() {
  const [isVisible, setIsVisible] = useState(true)

  return (
    <Card className="p-6 bg-gradient-to-br from-primary to-accent text-primary-foreground">
      <div className="flex items-start justify-between mb-6">
        <div>
          <p className="text-sm opacity-90 mb-1">Total Balance</p>
          <div className="flex items-baseline gap-2">
            <h2 className="text-4xl font-bold">{isVisible ? "$42,584.32" : "••••••"}</h2>
          </div>
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setIsVisible(!isVisible)}
          className="h-8 w-8 text-primary-foreground hover:bg-primary-foreground/20"
        >
          {isVisible ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
        </Button>
      </div>

      <div className="flex items-center gap-2 text-sm">
        <div className="flex items-center gap-1 text-primary-foreground">
          <TrendingUp className="h-4 w-4" />
          <span className="font-medium">+2.4%</span>
        </div>
        <span className="opacity-80">from last month</span>
      </div>
    </Card>
  )
}
