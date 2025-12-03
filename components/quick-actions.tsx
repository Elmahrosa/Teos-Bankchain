import { ArrowDownLeft, ArrowUpRight, Repeat, QrCode } from "lucide-react"
import { Button } from "@/components/ui/button"

const actions = [
  { icon: ArrowDownLeft, label: "Deposit", color: "text-primary" },
  { icon: ArrowUpRight, label: "Send", color: "text-foreground" },
  { icon: Repeat, label: "Exchange", color: "text-foreground" },
  { icon: QrCode, label: "Scan", color: "text-foreground" },
]

export function QuickActions() {
  return (
    <div className="grid grid-cols-4 gap-3">
      {actions.map((action) => (
        <Button
          key={action.label}
          variant="outline"
          className="flex flex-col items-center gap-2 h-auto py-4 bg-card hover:bg-muted"
        >
          <action.icon className={`h-5 w-5 ${action.color}`} />
          <span className="text-xs font-medium text-foreground">{action.label}</span>
        </Button>
      ))}
    </div>
  )
}
