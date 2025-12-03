"use client"

import type React from "react"

import { useState } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { AlertCircle, CheckCircle2, Loader2 } from "lucide-react"
import { apiClient } from "@/lib/api-client"

interface SupportTicketDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  language?: "en" | "ar"
  conversationHistory?: any[]
}

export function SupportTicketDialog({
  open,
  onOpenChange,
  language = "en",
  conversationHistory,
}: SupportTicketDialogProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [ticketId, setTicketId] = useState<string>("")
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    priority: "medium",
    category: "general",
    subject: "",
    description: "",
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const ticket = {
        ...formData,
        conversation_history: conversationHistory,
        language,
        created_at: new Date().toISOString(),
      }

      // Log the handoff in compliance audit
      await apiClient.post("/api/v1/compliance/audit-log", {
        event_type: "support_ticket_created",
        action: "create_ticket",
        resource_type: "support_ticket",
        details: {
          ticket,
          handoff_type: "ai_to_human",
          timestamp: new Date().toISOString(),
        },
      })

      // Generate ticket ID
      const newTicketId = `TKT-${Date.now().toString().slice(-8)}`
      setTicketId(newTicketId)
      setSubmitted(true)

      // Reset form after delay
      setTimeout(() => {
        setSubmitted(false)
        onOpenChange(false)
        setFormData({
          name: "",
          email: "",
          priority: "medium",
          category: "general",
          subject: "",
          description: "",
        })
      }, 5000)
    } catch (error) {
      console.error("[v0] Failed to create support ticket:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const isArabic = language === "ar"

  if (submitted) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-md">
          <div className="flex flex-col items-center justify-center py-8 text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center">
              <CheckCircle2 className="w-8 h-8 text-green-600 dark:text-green-400" />
            </div>
            <div className="space-y-2">
              <h3 className="text-lg font-semibold">
                {isArabic ? "تم إنشاء التذكرة بنجاح" : "Ticket Created Successfully"}
              </h3>
              <p className="text-sm text-muted-foreground">
                {isArabic ? `رقم التذكرة: ${ticketId}` : `Ticket ID: ${ticketId}`}
              </p>
              <p className="text-sm text-muted-foreground">
                {isArabic
                  ? "سيتواصل معك فريق الدعم خلال 4 ساعات عمل"
                  : "Our support team will contact you within 4 business hours"}
              </p>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    )
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{isArabic ? "إنشاء تذكرة دعم" : "Create Support Ticket"}</DialogTitle>
          <DialogDescription>
            {isArabic
              ? "املأ النموذج أدناه وسيتواصل معك فريق الدعم قريباً"
              : "Fill out the form below and our support team will get back to you soon"}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">{isArabic ? "الاسم" : "Name"}</Label>
              <Input
                id="name"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder={isArabic ? "الاسم الكامل" : "Full name"}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">{isArabic ? "البريد الإلكتروني" : "Email"}</Label>
              <Input
                id="email"
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder={isArabic ? "بريدك الإلكتروني" : "your@email.com"}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="priority">{isArabic ? "الأولوية" : "Priority"}</Label>
              <Select
                value={formData.priority}
                onValueChange={(value) => setFormData({ ...formData, priority: value })}
              >
                <SelectTrigger id="priority">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">{isArabic ? "منخفضة" : "Low"}</SelectItem>
                  <SelectItem value="medium">{isArabic ? "متوسطة" : "Medium"}</SelectItem>
                  <SelectItem value="high">{isArabic ? "عالية" : "High"}</SelectItem>
                  <SelectItem value="critical">{isArabic ? "حرجة" : "Critical"}</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="category">{isArabic ? "الفئة" : "Category"}</Label>
              <Select
                value={formData.category}
                onValueChange={(value) => setFormData({ ...formData, category: value })}
              >
                <SelectTrigger id="category">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="general">{isArabic ? "عام" : "General"}</SelectItem>
                  <SelectItem value="technical">{isArabic ? "تقني" : "Technical"}</SelectItem>
                  <SelectItem value="compliance">{isArabic ? "الامتثال" : "Compliance"}</SelectItem>
                  <SelectItem value="billing">{isArabic ? "الفوترة" : "Billing"}</SelectItem>
                  <SelectItem value="security">{isArabic ? "الأمان" : "Security"}</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="subject">{isArabic ? "الموضوع" : "Subject"}</Label>
            <Input
              id="subject"
              required
              value={formData.subject}
              onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
              placeholder={isArabic ? "موضوع المشكلة" : "Brief description of the issue"}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">{isArabic ? "الوصف" : "Description"}</Label>
            <Textarea
              id="description"
              required
              rows={6}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder={isArabic ? "يرجى تقديم تفاصيل حول مشكلتك..." : "Please provide details about your issue..."}
            />
          </div>

          {conversationHistory && conversationHistory.length > 0 && (
            <div className="flex items-start gap-2 p-3 bg-blue-50 dark:bg-blue-950 rounded-lg border border-blue-200 dark:border-blue-800">
              <AlertCircle className="w-4 h-4 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" />
              <p className="text-xs text-blue-900 dark:text-blue-100">
                {isArabic
                  ? "سيتم تضمين محادثتك مع المساعد الذكي للسياق"
                  : "Your AI assistant conversation will be included for context"}
              </p>
            </div>
          )}

          <div className="flex gap-2 justify-end pt-4">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={isSubmitting}>
              {isArabic ? "إلغاء" : "Cancel"}
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  {isArabic ? "جارٍ الإرسال..." : "Submitting..."}
                </>
              ) : (
                <>{isArabic ? "إرسال التذكرة" : "Submit Ticket"}</>
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
