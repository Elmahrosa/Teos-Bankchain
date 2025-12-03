import { Card } from "@/components/ui/card"
import { ArrowDownLeft, ArrowUpRight, Repeat } from "lucide-react"

const transactions = [
  {
    id: 1,
    type: "receive",
    title: "Salary Deposit",
    subtitle: "From Employer Inc",
    amount: "+$4,250.00",
    date: "Today, 9:30 AM",
    icon: ArrowDownLeft,
    positive: true,
  },
  {
    id: 2,
    type: "send",
    title: "Pi Network Exchange",
    subtitle: "To USD Account",
    amount: "-125.50 π",
    date: "Yesterday, 2:15 PM",
    icon: Repeat,
    positive: false,
  },
  {
    id: 3,
    type: "send",
    title: "Transfer to John",
    subtitle: "Via Teos Bridge",
    amount: "-$350.00",
    date: "Dec 28, 11:45 AM",
    icon: ArrowUpRight,
    positive: false,
  },
  {
    id: 4,
    type: "receive",
    title: "Pi Mining Reward",
    subtitle: "From Pi Network",
    amount: "+42.75 π",
    date: "Dec 27, 8:00 PM",
    icon: ArrowDownLeft,
    positive: true,
  },
]

export function RecentTransactions() {
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between px-1">
        <h2 className="text-lg font-semibold text-foreground">Recent Activity</h2>
        <button className="text-sm text-primary font-medium">View All</button>
      </div>

      <div className="space-y-2">
        {transactions.map((transaction) => (
          <Card key={transaction.id} className="p-4 hover:bg-muted/50 transition-colors">
            <div className="flex items-center gap-3">
              <div
                className={`h-10 w-10 rounded-full flex items-center justify-center ${
                  transaction.positive ? "bg-primary/10" : "bg-muted"
                }`}
              >
                <transaction.icon
                  className={`h-5 w-5 ${transaction.positive ? "text-primary" : "text-muted-foreground"}`}
                />
              </div>

              <div className="flex-1 min-w-0">
                <p className="font-medium text-foreground text-sm truncate">{transaction.title}</p>
                <p className="text-xs text-muted-foreground truncate">{transaction.subtitle}</p>
              </div>

              <div className="text-right">
                <p className={`font-semibold text-sm ${transaction.positive ? "text-primary" : "text-foreground"}`}>
                  {transaction.amount}
                </p>
                <p className="text-xs text-muted-foreground whitespace-nowrap">{transaction.date}</p>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
}
