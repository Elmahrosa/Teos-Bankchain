"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import {
  MessageCircle,
  X,
  Send,
  Loader2,
  Bot,
  User,
  Sparkles,
  HelpCircle,
  TrendingUp,
  Shield,
  Globe,
  AlertCircle,
  PhoneCall,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { apiClient } from "@/lib/api-client"
import { SupportTicketDialog } from "./support-ticket-dialog"
import { getContactMessage } from "@/lib/contact-service"

interface Message {
  id: string
  role: "user" | "assistant" | "system"
  content: string
  timestamp: Date
  language?: "en" | "ar"
}

const QUICK_QUESTIONS = {
  en: [
    { icon: HelpCircle, text: "How do I create a wallet?" },
    { icon: TrendingUp, text: "Check my transaction status" },
    { icon: Shield, text: "What are compliance requirements?" },
    { icon: MessageCircle, text: "Talk to support" },
  ],
  ar: [
    { icon: HelpCircle, text: "كيف أنشئ محفظة؟" },
    { icon: TrendingUp, text: "تحقق من حالة المعاملة" },
    { icon: Shield, text: "ما هي متطلبات الامتثال؟" },
    { icon: MessageCircle, text: "تحدث مع الدعم" },
  ],
}

const COMPLIANCE_KNOWLEDGE = {
  kyc: {
    en: "KYC (Know Your Customer) requirements:\n\n• Full legal name\n• Date of birth & Nationality\n• Residential address\n• Government-issued ID\n• Proof of address\n• Source of funds declaration\n\nVerification process: Document upload → Automated verification → Liveness check → Risk assessment → Compliance officer approval.\n\nRisk categories: Low (regular transactions), Medium (higher volumes, PEP), High (cross-border, suspicious patterns).",
    ar: "متطلبات اعرف عميلك (KYC):\n\n• الاسم القانوني الكامل\n• تاريخ الميلاد والجنسية\n• عنوان السكن\n• الهوية الحكومية\n• إثبات العنوان\n• إقرار مصدر الأموال\n\nعملية التحقق: تحميل المستندات ← التحقق الآلي ← فحص الحيوية ← تقييم المخاطر ← موافقة مسؤول الامتثال.\n\nفئات المخاطر: منخفضة (معاملات منتظمة)، متوسطة (حجم أعلى)، عالية (عبر الحدود، أنماط مشبوهة).",
  },
  aml: {
    en: "AML (Anti-Money Laundering) monitoring:\n\n• Transactions > $10,000 flagged automatically\n• Daily aggregates > $25,000 reviewed\n• Structured transactions detected (smurfing)\n• Rapid fund movement monitored\n\nAlert severities:\n• Critical: Immediate review, transaction held\n• High: Review within 2 hours\n• Medium: Review within 24 hours\n• Low: Batch review weekly",
    ar: "مراقبة مكافحة غسل الأموال (AML):\n\n• المعاملات > 10,000 دولار يتم وضع علامة عليها تلقائياً\n• الإجماليات اليومية > 25,000 دولار يتم مراجعتها\n• كشف المعاملات المنظمة\n• مراقبة حركة الأموال السريعة\n\nشدة التنبيهات:\n• حرجة: مراجعة فورية، إيقاف المعاملة\n• عالية: مراجعة خلال ساعتين\n• متوسطة: مراجعة خلال 24 ساعة\n• منخفضة: مراجعة دورية أسبوعياً",
  },
  sanctions: {
    en: "Sanctions screening:\n\n• OFAC (Office of Foreign Assets Control)\n• UN Security Council Sanctions\n• EU Sanctions List\n• Egyptian national sanctions\n\nScreening occurs at:\n• New user registration\n• Transaction initiation\n• Daily batch screening\n• Real-time transaction checks\n\nMatches are immediately flagged for compliance review.",
    ar: "فحص العقوبات:\n\n• مكتب مراقبة الأصول الأجنبية (OFAC)\n• عقوبات مجلس الأمن الدولي\n• قائمة عقوبات الاتحاد الأوروبي\n• العقوبات الوطنية المصرية\n\nيحدث الفحص عند:\n• تسجيل مستخدم جديد\n• بدء المعاملة\n• الفحص الدوري اليومي\n• الفحص الفوري للمعاملات\n\nيتم وضع علامة على التطابقات فوراً للمراجعة.",
  },
  reporting: {
    en: "Regulatory reporting requirements:\n\nDaily: Transaction volume summary, high-value transactions\nMonthly: KYC statistics, AML alerts, SAR filings\nQuarterly: Compliance effectiveness, risk updates\nAnnual: Comprehensive review, audit results\n\nReports submitted to:\n• Central Bank of Egypt (CBE)\n• Financial Intelligence Unit (FIU)\n• Internal stakeholders\n\nAll reports are digitally signed and encrypted.",
    ar: "متطلبات التقارير التنظيمية:\n\nيومياً: ملخص حجم المعاملات، المعاملات عالية القيمة\nشهرياً: إحصائيات KYC، تنبيهات AML، تقارير SAR\nربع سنوي: فعالية الامتثال، تحديثات المخاطر\nسنوي: مراجعة شاملة، نتائج التدقيق\n\nتقدم التقارير إلى:\n• البنك المركزي المصري\n• وحدة المعلومات المالية\n• أصحاب المصلحة الداخليين\n\nجميع التقارير موقعة رقمياً ومشفرة.",
  },
}

export function AIChatAssistant() {
  const [isOpen, setIsOpen] = useState(false)
  const [language, setLanguage] = useState<"en" | "ar">("en")
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      role: "assistant",
      content:
        language === "en"
          ? "Hello! I'm your TEOS Bankchain assistant. How can I help you today?"
          : "مرحباً! أنا مساعد TEOS Bankchain الخاص بك. كيف يمكنني مساعدتك اليوم؟",
      timestamp: new Date(),
      language,
    },
  ])
  const [inputValue, setInputValue] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [needsEscalation, setNeedsEscalation] = useState(false)
  const [showTicketDialog, setShowTicketDialog] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  useEffect(() => {
    if (isOpen) {
      inputRef.current?.focus()
    }
  }, [isOpen])

  useEffect(() => {
    setMessages([
      {
        id: "welcome",
        role: "assistant",
        content:
          language === "en"
            ? "Hello! I'm your TEOS Bankchain assistant. How can I help you today?"
            : "مرحباً! أنا مساعد TEOS Bankchain الخاص بك. كيف يمكنني مساعدتك اليوم؟",
        timestamp: new Date(),
        language,
      },
    ])
  }, [language])

  const logInteraction = async (userMessage: string, assistantResponse: string) => {
    try {
      await apiClient.post("/api/v1/compliance/audit-log", {
        event_type: "ai_assistant_interaction",
        action: "chat_message",
        resource_type: "ai_assistant",
        details: {
          user_message: userMessage,
          assistant_response: assistantResponse,
          language: language,
          timestamp: new Date().toISOString(),
        },
      })
    } catch (error) {
      console.error("[v0] Failed to log AI interaction:", error)
    }
  }

  const handleSendMessage = async (content?: string) => {
    const messageText = content || inputValue.trim()
    if (!messageText || isLoading) return

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: messageText,
      timestamp: new Date(),
      language,
    }

    setMessages((prev) => [...prev, userMessage])
    setInputValue("")
    setIsLoading(true)

    setTimeout(async () => {
      const response = getAIResponse(messageText)
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: response,
        timestamp: new Date(),
        language,
      }
      setMessages((prev) => [...prev, assistantMessage])
      setIsLoading(false)

      await logInteraction(messageText, response)

      if (response.includes("escalate") || response.includes("human support") || response.includes("دعم بشري")) {
        setNeedsEscalation(true)
      }
    }, 1000)
  }

  const getAIResponse = (question: string): string => {
    const lowerQ = question.toLowerCase()
    const isArabic = language === "ar"

    // Compliance-related queries from knowledge base
    if (lowerQ.includes("kyc") || lowerQ.includes("know your customer") || lowerQ.includes("اعرف عميلك")) {
      return COMPLIANCE_KNOWLEDGE.kyc[language]
    }

    if (lowerQ.includes("aml") || lowerQ.includes("money laundering") || lowerQ.includes("غسل الأموال")) {
      return COMPLIANCE_KNOWLEDGE.aml[language]
    }

    if (lowerQ.includes("sanctions") || lowerQ.includes("ofac") || lowerQ.includes("عقوبات")) {
      return COMPLIANCE_KNOWLEDGE.sanctions[language]
    }

    if (
      lowerQ.includes("report") ||
      lowerQ.includes("regulatory") ||
      lowerQ.includes("تقارير") ||
      lowerQ.includes("تنظيمية")
    ) {
      return COMPLIANCE_KNOWLEDGE.reporting[language]
    }

    // Wallet queries
    if (
      lowerQ.includes("wallet") ||
      lowerQ.includes("create") ||
      lowerQ.includes("محفظة") ||
      lowerQ.includes("إنشاء")
    ) {
      return isArabic
        ? "لإنشاء محفظة:\n\n1. انتقل إلى صفحة المحافظ\n2. انقر على 'إنشاء محفظة جديدة'\n3. اختر بين الحفظ الذاتي أو غير الذاتي\n4. اختر عملتك (EGP، USD، SAR، أو PI)\n5. أكد الإنشاء\n\nستكون محفظتك جاهزة على الفور. هل تحتاج مساعدة في شيء آخر؟"
        : "To create a wallet:\n\n1. Go to the Wallets page\n2. Click 'Create New Wallet'\n3. Choose between custodial or non-custodial\n4. Select your currency (EGP, USD, SAR, or PI)\n5. Confirm creation\n\nYour wallet will be ready instantly. Would you like help with anything else?"
    }

    // Transaction queries
    if (
      lowerQ.includes("transaction") ||
      lowerQ.includes("transfer") ||
      lowerQ.includes("معاملة") ||
      lowerQ.includes("تحويل")
    ) {
      return isArabic
        ? "يمكنك التحقق من حالة معاملتك في صفحة المعاملات. كل معاملة تعرض:\n\n• معرف المعاملة\n• المبلغ والعملة\n• الحالة (معلقة، مكتملة، موضوع علامة)\n• درجة المخاطر\n• حالة الموافقة\n\nالمعاملات التي تزيد عن 1,000 دولار تتطلب موافقة متعددة المستويات. هل تحتاج مساعدة في معاملة معينة؟"
        : "You can check your transaction status in the Transactions page. Each transaction shows:\n\n• Transaction ID\n• Amount and currency\n• Status (pending, completed, flagged)\n• Risk score\n• Approval status\n\nTransactions over $1,000 require multi-tier approval. Need help with a specific transaction?"
    }

    // Support escalation
    if (
      lowerQ.includes("support") ||
      lowerQ.includes("help") ||
      lowerQ.includes("contact") ||
      lowerQ.includes("دعم") ||
      lowerQ.includes("مساعدة") ||
      lowerQ.includes("اتصال")
    ) {
      return (
        getContactMessage(language) +
        (isArabic ? "\n\nهل يمكنني مساعدتك الآن؟" : "\n\nWhat can I help you with right now?")
      )
    }

    // FX queries
    if (
      lowerQ.includes("fx") ||
      lowerQ.includes("exchange") ||
      lowerQ.includes("rate") ||
      lowerQ.includes("صرف") ||
      lowerQ.includes("سعر")
    ) {
      return isArabic
        ? "أسعار الصرف الحالية متاحة في صفحة المحافظ. ندعم:\n\n• EGP (الجنيه المصري)\n• USD (الدولار الأمريكي)\n• SAR (الريال السعودي)\n• PI (شبكة Pi)\n\nيتم تحديث الأسعار في الوقت الفعلي من مزودين متعددين. يمكنك تحويل العملات عند إجراء التحويلات. هل تحتاج الأسعار الحالية؟"
        : "Current FX rates are available on the Wallets page. We support:\n\n• EGP (Egyptian Pound)\n• USD (US Dollar)\n• SAR (Saudi Riyal)\n• PI (Pi Network)\n\nRates are updated in real-time from multiple providers. You can convert currencies when making transfers. Need current rates?"
    }

    return isArabic
      ? "يبدو أن سؤالك يتطلب مساعدة متخصصة. يمكنني مساعدتك في:\n\n• إدارة المحفظة\n• المعاملات والتحويلات\n• الامتثال وKYC\n• أسعار الصرف وتحويل العملات\n• إعدادات الحساب\n\nللحصول على مساعدة متقدمة، يمكنني توصيلك بفريق الدعم البشري. هل تريد التحدث إلى أحد المتخصصين؟"
      : "It looks like your question requires specialized assistance. I can help with:\n\n• Wallet management\n• Transactions and transfers\n• Compliance and KYC\n• FX rates and currency conversion\n• Account settings\n\nFor advanced help, I can connect you with our human support team. Would you like to speak with a specialist?"
  }

  const handleEscalation = async () => {
    const escalationMessage: Message = {
      id: Date.now().toString(),
      role: "system",
      content:
        language === "en"
          ? "Connecting you to human support. Would you like to create a support ticket?"
          : "جارٍ توصيلك بالدعم البشري. هل ترغب في إنشاء تذكرة دعم؟",
      timestamp: new Date(),
      language,
    }
    setMessages((prev) => [...prev, escalationMessage])

    await apiClient.post("/api/v1/compliance/audit-log", {
      event_type: "ai_assistant_handoff",
      action: "escalate_to_human",
      resource_type: "ai_assistant",
      details: {
        conversation: messages,
        language: language,
        handoff_reason: "user_request",
        timestamp: new Date().toISOString(),
      },
    })

    setShowTicketDialog(true)
    setNeedsEscalation(false)
  }

  return (
    <>
      {!isOpen && (
        <Button
          onClick={() => setIsOpen(true)}
          size="lg"
          className="fixed bottom-24 right-4 z-50 h-14 w-14 rounded-full shadow-2xl hover:scale-110 transition-transform bg-gradient-to-br from-primary to-primary/80"
        >
          <div className="relative">
            <MessageCircle className="w-6 h-6" />
            <Sparkles className="w-3 h-3 absolute -top-1 -right-1 text-accent animate-pulse" />
          </div>
        </Button>
      )}

      {isOpen && (
        <Card className="fixed bottom-24 right-4 z-50 w-[calc(100vw-2rem)] max-w-md h-[32rem] flex flex-col shadow-2xl border-2 border-primary/20">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b bg-gradient-to-r from-primary to-primary/90">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="w-10 h-10 rounded-full bg-accent/20 flex items-center justify-center border-2 border-accent/40">
                  <Bot className="w-5 h-5 text-accent" />
                </div>
                <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 rounded-full border-2 border-primary" />
              </div>
              <div>
                <h3 className="font-semibold text-primary-foreground text-sm">TEOS Assistant</h3>
                <p className="text-xs text-primary-foreground/80 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse" />
                  {language === "en" ? "Online" : "متصل"}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setLanguage(language === "en" ? "ar" : "en")}
                className="h-8 px-2 text-primary-foreground hover:bg-primary-foreground/10"
              >
                <Globe className="w-4 h-4 mr-1" />
                {language === "en" ? "AR" : "EN"}
              </Button>
              <Badge variant="secondary" className="bg-accent/20 text-accent-foreground border-accent/40">
                <Sparkles className="w-3 h-3 mr-1" />
                AI
              </Badge>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsOpen(false)}
                className="h-8 w-8 text-primary-foreground hover:bg-primary-foreground/10"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gradient-to-b from-background to-muted/20">
            {messages.map((message) => (
              <div
                key={message.id}
                className={cn("flex gap-3 animate-in fade-in-0 slide-in-from-bottom-2", {
                  "flex-row-reverse": message.role === "user",
                })}
              >
                <div
                  className={cn("w-8 h-8 rounded-full flex items-center justify-center shrink-0 border-2", {
                    "bg-primary border-primary/20": message.role === "assistant",
                    "bg-accent border-accent/20": message.role === "user",
                    "bg-orange-500 border-orange-500/20": message.role === "system",
                  })}
                >
                  {message.role === "assistant" ? (
                    <Bot className="w-4 h-4 text-primary-foreground" />
                  ) : message.role === "system" ? (
                    <AlertCircle className="w-4 h-4 text-white" />
                  ) : (
                    <User className="w-4 h-4 text-accent-foreground" />
                  )}
                </div>
                <div
                  className={cn("flex-1 space-y-1", {
                    "items-end": message.role === "user",
                  })}
                >
                  <div
                    className={cn("rounded-2xl px-4 py-2.5 max-w-[85%] shadow-sm", {
                      "bg-primary text-primary-foreground ml-0": message.role === "assistant",
                      "bg-accent text-accent-foreground ml-auto": message.role === "user",
                      "bg-orange-500 text-white ml-0": message.role === "system",
                    })}
                    dir={message.language === "ar" ? "rtl" : "ltr"}
                  >
                    <p className="text-sm whitespace-pre-wrap leading-relaxed">{message.content}</p>
                  </div>
                  <p className="text-xs text-muted-foreground px-2">
                    {message.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                  </p>
                </div>
              </div>
            ))}

            {isLoading && (
              <div className="flex gap-3 animate-in fade-in-0">
                <div className="w-8 h-8 rounded-full bg-primary border-2 border-primary/20 flex items-center justify-center shrink-0">
                  <Bot className="w-4 h-4 text-primary-foreground" />
                </div>
                <div className="bg-primary/10 rounded-2xl px-4 py-3 border border-primary/20">
                  <div className="flex gap-1">
                    <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                    <div
                      className="w-2 h-2 bg-primary rounded-full animate-bounce"
                      style={{ animationDelay: "150ms" }}
                    />
                    <div
                      className="w-2 h-2 bg-primary rounded-full animate-bounce"
                      style={{ animationDelay: "300ms" }}
                    />
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {needsEscalation && (
            <div className="px-4 py-3 bg-orange-50 dark:bg-orange-950 border-t border-orange-200 dark:border-orange-800">
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2 text-sm">
                  <PhoneCall className="w-4 h-4 text-orange-600 dark:text-orange-400" />
                  <span className="text-orange-900 dark:text-orange-100">
                    {language === "en" ? "Need human support?" : "تحتاج دعم بشري؟"}
                  </span>
                </div>
                <Button size="sm" onClick={handleEscalation} className="bg-orange-600 hover:bg-orange-700 text-white">
                  {language === "en" ? "Connect Now" : "اتصل الآن"}
                </Button>
              </div>
            </div>
          )}

          {/* Quick questions */}
          {messages.length === 1 && (
            <div className="p-4 border-t bg-muted/20 space-y-2">
              <p className="text-xs text-muted-foreground font-medium mb-2" dir={language === "ar" ? "rtl" : "ltr"}>
                {language === "en" ? "Quick questions:" : "أسئلة سريعة:"}
              </p>
              <div className="grid grid-cols-2 gap-2">
                {QUICK_QUESTIONS[language].map((q, i) => (
                  <Button
                    key={i}
                    variant="outline"
                    size="sm"
                    onClick={() => handleSendMessage(q.text)}
                    className="h-auto py-2 px-3 justify-start text-left bg-transparent hover:bg-primary/5 hover:border-primary/40"
                    dir={language === "ar" ? "rtl" : "ltr"}
                  >
                    <q.icon className="w-3.5 h-3.5 mr-2 shrink-0 text-primary" />
                    <span className="text-xs truncate">{q.text}</span>
                  </Button>
                ))}
              </div>
            </div>
          )}

          {/* Input */}
          <div className="p-4 border-t bg-background">
            <div className="flex gap-2" dir={language === "ar" ? "rtl" : "ltr"}>
              <Input
                ref={inputRef}
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
                placeholder={language === "en" ? "Ask me anything..." : "اسألني أي شيء..."}
                className="flex-1 bg-muted/50 border-muted-foreground/20 focus:border-primary"
                disabled={isLoading}
                dir={language === "ar" ? "rtl" : "ltr"}
              />
              <Button
                onClick={() => handleSendMessage()}
                disabled={!inputValue.trim() || isLoading}
                size="icon"
                className="shrink-0 bg-gradient-to-br from-primary to-primary/80 hover:scale-105 transition-transform"
              >
                {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
              </Button>
            </div>
            <p className="text-xs text-muted-foreground mt-2 text-center" dir={language === "ar" ? "rtl" : "ltr"}>
              {language === "en" ? "Powered by TEOS AI • Available 24/7" : "مدعوم بـ TEOS AI • متاح 24/7"}
            </p>
          </div>
        </Card>
      )}

      {/* Support ticket dialog */}
      <SupportTicketDialog
        open={showTicketDialog}
        onOpenChange={setShowTicketDialog}
        language={language}
        conversationHistory={messages}
      />
    </>
  )
}
