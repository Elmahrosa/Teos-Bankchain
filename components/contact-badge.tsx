import { Building2, Mail, Phone, Globe } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { getContactInfo } from "@/lib/contact-service"

interface ContactBadgeProps {
  variant?: "compact" | "full"
}

export function ContactBadge({ variant = "compact" }: ContactBadgeProps) {
  const contact = getContactInfo()

  if (variant === "compact") {
    return (
      <div className="flex items-center justify-center gap-2 flex-wrap">
        <Badge variant="outline" className="gap-1.5 py-1 px-2.5 border-primary/20 bg-primary/5">
          <Building2 className="w-3 h-3 text-primary" />
          <span className="text-xs font-medium">TEOS Egypt</span>
        </Badge>
        <Badge variant="outline" className="gap-1.5 py-1 px-2.5 border-accent/20 bg-accent/5">
          <Building2 className="w-3 h-3 text-accent" />
          <span className="text-xs font-medium">Elmahrosa</span>
        </Badge>
      </div>
    )
  }

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2 flex-wrap">
        <Badge variant="outline" className="gap-1.5 py-1.5 px-3 border-primary/20 bg-primary/5">
          <Building2 className="w-3.5 h-3.5 text-primary" />
          <span className="text-xs font-semibold">TEOS Egypt</span>
        </Badge>
        <Badge variant="outline" className="gap-1.5 py-1.5 px-3 border-accent/20 bg-accent/5">
          <Building2 className="w-3.5 h-3.5 text-accent" />
          <span className="text-xs font-semibold">Elmahrosa</span>
        </Badge>
      </div>
      <div className="flex items-center gap-2 flex-wrap text-xs text-muted-foreground">
        <div className="flex items-center gap-1">
          <Mail className="w-3 h-3" />
          <span>{contact.email.primary}</span>
        </div>
        <div className="flex items-center gap-1">
          <Phone className="w-3 h-3" />
          <span>{contact.phone.number}</span>
        </div>
        <div className="flex items-center gap-1">
          <Globe className="w-3 h-3" />
          <span>{contact.website.main.replace("https://", "")}</span>
        </div>
      </div>
    </div>
  )
}
