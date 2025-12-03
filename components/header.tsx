import { Bell, Menu, Building2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"

export function Header() {
  return (
    <header className="flex items-center justify-between px-4 py-4 bg-card border-b border-border">
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" className="h-9 w-9">
          <Menu className="h-5 w-5" />
        </Button>
        <Link href="/">
          <div className="cursor-pointer">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center">
                <Building2 className="h-4 w-4 text-primary-foreground" />
              </div>
              <h1 className="text-lg font-bold text-foreground">Teos Bankchain</h1>
            </div>
            <div className="flex items-center gap-1.5 mt-1">
              <a
                href="https://teosegypt.com"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:scale-105 transition-transform"
              >
                <Badge
                  variant="outline"
                  className="h-4 px-1.5 text-[10px] font-medium border-primary/30 bg-primary/5 cursor-pointer hover:bg-primary/10"
                >
                  TEOS Egypt
                </Badge>
              </a>
              <a
                href="https://github.com/elmahrosa"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:scale-105 transition-transform"
              >
                <Badge
                  variant="outline"
                  className="h-4 px-1.5 text-[10px] font-medium border-accent/30 bg-accent/5 cursor-pointer hover:bg-accent/10"
                >
                  Elmahrosa
                </Badge>
              </a>
            </div>
          </div>
        </Link>
      </div>
      <Button variant="ghost" size="icon" className="h-9 w-9 relative">
        <Bell className="h-5 w-5" />
        <span className="absolute top-2 right-2 h-2 w-2 bg-destructive rounded-full" />
      </Button>
    </header>
  )
}
