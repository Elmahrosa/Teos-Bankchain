import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowRight, Coins } from "lucide-react"

export function PiNetworkCard() {
  return (
    <Card className="p-5 bg-gradient-to-r from-accent/10 to-primary/10 border-primary/20">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="h-12 w-12 rounded-full bg-primary/20 flex items-center justify-center">
            <Coins className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h3 className="font-semibold text-foreground mb-1">Pi Network</h3>
            <p className="text-xs text-muted-foreground">Connected Wallet</p>
          </div>
        </div>
        <div className="text-right">
          <p className="text-lg font-bold text-foreground">1,247.58 π</p>
          <p className="text-xs text-muted-foreground">≈ $3,742.74</p>
        </div>
      </div>

      <div className="flex items-center gap-2 pt-3 border-t border-border">
        <Button className="flex-1 bg-primary text-primary-foreground hover:bg-primary/90">Convert to USD</Button>
        <Button variant="outline" size="icon" className="h-10 w-10 bg-transparent">
          <ArrowRight className="h-4 w-4" />
        </Button>
      </div>
    </Card>
  )
}
