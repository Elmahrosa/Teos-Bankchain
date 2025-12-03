"use client"

import { Home, Wallet, BarChart3, Settings, LayoutDashboard, Users } from "lucide-react"
import { usePathname, useRouter } from "next/navigation"
import { useAuth } from "@/contexts/auth-context"

export function BottomNav() {
  const pathname = usePathname()
  const router = useRouter()
  const { user } = useAuth()

  const getNavItems = () => {
    const baseItems = [
      { icon: Home, label: "Home", path: "/dashboard" },
      { icon: Wallet, label: "Wallets", path: "/wallets" },
      { icon: BarChart3, label: "Activity", path: "/transactions" },
      { icon: Settings, label: "Settings", path: "/settings" },
    ]

    // For bank admins, show founder dashboard link
    if (user?.role === "bank_admin") {
      return [
        { icon: LayoutDashboard, label: "Executive", path: "/founder-dashboard" },
        { icon: Users, label: "Admin", path: "/dashboard" },
        { icon: Wallet, label: "Wallets", path: "/wallets" },
        { icon: Settings, label: "Settings", path: "/settings" },
      ]
    }

    // For individual and business users, show client dashboard
    if (user?.role === "individual" || user?.role === "business") {
      return [
        { icon: Home, label: "Home", path: "/client-dashboard" },
        { icon: Wallet, label: "Wallets", path: "/wallets" },
        { icon: BarChart3, label: "Activity", path: "/transactions" },
        { icon: Settings, label: "Settings", path: "/settings" },
      ]
    }

    return baseItems
  }

  const navItems = getNavItems()

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-card border-t border-border z-50">
      <div className="flex items-center justify-around h-16 px-4">
        {navItems.map((item) => {
          const isActive = pathname === item.path || pathname?.startsWith(item.path + "/")
          return (
            <button
              key={item.label}
              onClick={() => router.push(item.path)}
              className={`flex flex-col items-center justify-center gap-1 flex-1 h-full transition-colors ${
                isActive ? "text-primary" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <item.icon className="h-5 w-5" />
              <span className="text-xs font-medium">{item.label}</span>
            </button>
          )
        })}
      </div>
      <div className="absolute bottom-0 left-0 right-0 h-px bg-primary/20" />
    </nav>
  )
}
