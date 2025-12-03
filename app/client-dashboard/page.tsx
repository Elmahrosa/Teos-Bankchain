"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/contexts/auth-context"
import { Header } from "@/components/header"
import { BottomNav } from "@/components/bottom-nav"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  ArrowUpRight,
  ArrowDownLeft,
  Eye,
  EyeOff,
  Send,
  Download,
  CreditCard,
  CheckCircle2,
  Clock,
  Wallet,
  Bell,
  Languages,
} from "lucide-react"
import { NotificationService } from "@/lib/notifications"

export default function ClientDashboardPage() {
  const { isAuthenticated, isLoading, user } = useAuth()
  const router = useRouter()
  const [balanceVisible, setBalanceVisible] = useState(true)
  const [language, setLanguage] = useState<"en" | "ar">("en")
  const [notifications, setNotifications] = useState(NotificationService.getNotifications())
  const [unreadCount, setUnreadCount] = useState(NotificationService.getUnreadCount())

  const [accountData, setAccountData] = useState({
    balance: 45230.5,
    currency: "EGP",
    piBalance: 125.75,
    accountNumber: "****8247",
    verificationStatus: "verified",
    recentTransactions: [
      {
        id: "tx_1",
        type: "credit",
        amount: 5000,
        currency: "EGP",
        description: "Salary Deposit",
        date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
        status: "completed",
      },
      {
        id: "tx_2",
        type: "debit",
        amount: 1500,
        currency: "EGP",
        description: "Utility Payment",
        date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
        status: "completed",
      },
      {
        id: "tx_3",
        type: "credit",
        amount: 25.5,
        currency: "PI",
        description: "Pi Network Transfer",
        date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
        status: "completed",
      },
      {
        id: "tx_4",
        type: "debit",
        amount: 750,
        currency: "EGP",
        description: "Online Purchase",
        date: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000),
        status: "completed",
      },
    ],
  })

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push("/login")
    }
  }, [isAuthenticated, isLoading, router])

  useEffect(() => {
    if (user && user.role !== "individual" && user.role !== "business") {
      router.push("/dashboard")
    }
  }, [user, router])

  useEffect(() => {
    const unsubscribe = NotificationService.subscribe((notifs) => {
      setNotifications(notifs.filter((n) => n.type === "transaction"))
      setUnreadCount(notifs.filter((n) => n.type === "transaction" && !n.read).length)
    })

    return unsubscribe
  }, [])

  const content = {
    en: {
      welcome: "Welcome back",
      overview: "Here's your account overview",
      totalBalance: "Total Balance",
      send: "Send",
      receive: "Receive",
      cards: "Cards",
      history: "History",
      recentTransactions: "Recent Transactions",
      latestActivity: "Your latest account activity",
      viewAll: "View All",
      accountStatus: "Account Status",
      securityVerification: "Security and verification",
      identityVerified: "Identity Verified",
      kycCompleted: "KYC completed",
      twoFactor: "Two-Factor Authentication",
      accountProtected: "Account protected",
      piConnected: "Pi Network Connected",
      cryptoEnabled: "Crypto payments enabled",
    },
    ar: {
      welcome: "مرحبا بعودتك",
      overview: "إليك نظرة عامة على حسابك",
      totalBalance: "الرصيد الإجمالي",
      send: "إرسال",
      receive: "استلام",
      cards: "البطاقات",
      history: "السجل",
      recentTransactions: "المعاملات الأخيرة",
      latestActivity: "آخر نشاط لحسابك",
      viewAll: "عرض الكل",
      accountStatus: "حالة الحساب",
      securityVerification: "الأمان والتحقق",
      identityVerified: "تم التحقق من الهوية",
      kycCompleted: "اكتمل التحقق",
      twoFactor: "المصادقة الثنائية",
      accountProtected: "الحساب محمي",
      piConnected: "متصل بشبكة Pi",
      cryptoEnabled: "المدفوعات الرقمية مفعلة",
    },
  }

  const t = content[language]

  if (isLoading || !isAuthenticated) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full mx-auto" />
          <p className="text-sm text-muted-foreground">Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background pb-20" dir={language === "ar" ? "rtl" : "ltr"}>
      <Header />
      <main className="px-4 pt-4 pb-6 space-y-6">
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <h1 className="text-2xl font-bold">
              {t.welcome}, {user?.name}
            </h1>
            <p className="text-sm text-muted-foreground">{t.overview}</p>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="icon"
              onClick={() => setLanguage(language === "en" ? "ar" : "en")}
              title={language === "en" ? "التبديل إلى العربية" : "Switch to English"}
            >
              <Languages className="w-4 h-4" />
            </Button>

            <Button variant="outline" size="icon" className="relative bg-transparent">
              <Bell className="w-4 h-4" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-primary text-white text-xs rounded-full flex items-center justify-center">
                  {unreadCount}
                </span>
              )}
            </Button>
          </div>
        </div>

        {/* Account Balance Card */}
        <Card className="border-primary/20 bg-gradient-to-br from-primary/10 via-primary/5 to-accent/5">
          <CardContent className="pt-6 pb-6 space-y-4">
            <div className="flex items-start justify-between">
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">{t.totalBalance}</p>
                <div className="flex items-center gap-2">
                  {balanceVisible ? (
                    <p className="text-3xl font-bold">
                      {accountData.balance.toLocaleString()} {accountData.currency}
                    </p>
                  ) : (
                    <p className="text-3xl font-bold">••••••</p>
                  )}
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => setBalanceVisible(!balanceVisible)}
                  >
                    {balanceVisible ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                </div>
                <div className="flex items-center gap-2 mt-2">
                  <Wallet className="w-4 h-4 text-muted-foreground" />
                  <p className="text-sm text-muted-foreground">
                    {accountData.piBalance} PI • {accountData.accountNumber}
                  </p>
                </div>
              </div>
              <Badge variant="secondary" className="bg-green-500/10 text-green-500">
                <CheckCircle2 className="w-3 h-3 mr-1" />
                Verified
              </Badge>
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <div className="grid grid-cols-4 gap-3">
          <Button
            variant="outline"
            className="h-20 flex-col gap-2 bg-transparent"
            onClick={() => router.push("/transactions")}
          >
            <Send className="w-5 h-5 text-primary" />
            <span className="text-xs">{t.send}</span>
          </Button>
          <Button
            variant="outline"
            className="h-20 flex-col gap-2 bg-transparent"
            onClick={() => router.push("/deposit")}
          >
            <Download className="w-5 h-5 text-accent" />
            <span className="text-xs">{t.receive}</span>
          </Button>
          <Button
            variant="outline"
            className="h-20 flex-col gap-2 bg-transparent"
            onClick={() => router.push("/wallets")}
          >
            <CreditCard className="w-5 h-5 text-blue-500" />
            <span className="text-xs">{t.cards}</span>
          </Button>
          <Button
            variant="outline"
            className="h-20 flex-col gap-2 bg-transparent"
            onClick={() => router.push("/transactions")}
          >
            <Clock className="w-5 h-5 text-orange-500" />
            <span className="text-xs">{t.history}</span>
          </Button>
        </div>

        {/* Recent Transactions */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>{t.recentTransactions}</CardTitle>
                <CardDescription>{t.latestActivity}</CardDescription>
              </div>
              <Button variant="ghost" size="sm" onClick={() => router.push("/transactions")}>
                {t.viewAll}
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            {accountData.recentTransactions.map((tx) => (
              <div key={tx.id} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center gap-3">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center ${
                      tx.type === "credit" ? "bg-green-500/10" : "bg-red-500/10"
                    }`}
                  >
                    {tx.type === "credit" ? (
                      <ArrowDownLeft className="w-5 h-5 text-green-500" />
                    ) : (
                      <ArrowUpRight className="w-5 h-5 text-red-500" />
                    )}
                  </div>
                  <div>
                    <p className="text-sm font-medium">{tx.description}</p>
                    <p className="text-xs text-muted-foreground">
                      {tx.date.toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className={`text-sm font-bold ${tx.type === "credit" ? "text-green-500" : "text-foreground"}`}>
                    {tx.type === "credit" ? "+" : "-"}
                    {tx.amount.toLocaleString()} {tx.currency}
                  </p>
                  <Badge variant="secondary" className="mt-1 text-xs">
                    {tx.status}
                  </Badge>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Account Status */}
        <Card>
          <CardHeader>
            <CardTitle>{t.accountStatus}</CardTitle>
            <CardDescription>{t.securityVerification}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center justify-between p-3 border rounded-lg">
              <div className="flex items-center gap-3">
                <CheckCircle2 className="w-5 h-5 text-green-500" />
                <div>
                  <p className="text-sm font-medium">{t.identityVerified}</p>
                  <p className="text-xs text-muted-foreground">{t.kycCompleted}</p>
                </div>
              </div>
              <Badge variant="secondary" className="bg-green-500/10 text-green-500">
                Active
              </Badge>
            </div>

            <div className="flex items-center justify-between p-3 border rounded-lg">
              <div className="flex items-center gap-3">
                <CheckCircle2 className="w-5 h-5 text-green-500" />
                <div>
                  <p className="text-sm font-medium">{t.twoFactor}</p>
                  <p className="text-xs text-muted-foreground">{t.accountProtected}</p>
                </div>
              </div>
              <Badge variant="secondary" className="bg-green-500/10 text-green-500">
                Enabled
              </Badge>
            </div>

            <div className="flex items-center justify-between p-3 border rounded-lg">
              <div className="flex items-center gap-3">
                <CheckCircle2 className="w-5 h-5 text-blue-500" />
                <div>
                  <p className="text-sm font-medium">{t.piConnected}</p>
                  <p className="text-xs text-muted-foreground">{t.cryptoEnabled}</p>
                </div>
              </div>
              <Badge variant="secondary" className="bg-blue-500/10 text-blue-500">
                Connected
              </Badge>
            </div>
          </CardContent>
        </Card>
      </main>
      <BottomNav />
    </div>
  )
}
