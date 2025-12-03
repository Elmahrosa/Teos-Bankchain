"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Wallet,
  ArrowRightLeft,
  Shield,
  Users,
  BarChart3,
  Globe2,
  Smartphone,
  Lock,
  Zap,
  FileCheck,
  DollarSign,
  Activity,
} from "lucide-react"

export default function FeaturesPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
      <div className="container max-w-6xl mx-auto px-4 py-8 space-y-8">
        {/* Hero Section */}
        <div className="text-center space-y-4 py-8">
          <Badge className="bg-primary text-primary-foreground">Comprehensive Feature Set</Badge>
          <h1 className="text-4xl md:text-5xl font-bold text-balance">Everything You Need for Digital Banking</h1>
          <p className="text-xl text-muted-foreground text-balance max-w-3xl mx-auto">
            From wallet management to compliance monitoring, TEOS BankChain provides all the tools needed to run a
            modern, secure digital bank.
          </p>
        </div>

        {/* Feature Tabs */}
        <Tabs defaultValue="wallets" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2 md:grid-cols-4 h-auto gap-2">
            <TabsTrigger value="wallets" className="flex items-center gap-2">
              <Wallet className="h-4 w-4" />
              <span className="hidden sm:inline">Wallets</span>
            </TabsTrigger>
            <TabsTrigger value="transactions" className="flex items-center gap-2">
              <ArrowRightLeft className="h-4 w-4" />
              <span className="hidden sm:inline">Transactions</span>
            </TabsTrigger>
            <TabsTrigger value="compliance" className="flex items-center gap-2">
              <Shield className="h-4 w-4" />
              <span className="hidden sm:inline">Compliance</span>
            </TabsTrigger>
            <TabsTrigger value="enterprise" className="flex items-center gap-2">
              <BarChart3 className="h-4 w-4" />
              <span className="hidden sm:inline">Enterprise</span>
            </TabsTrigger>
          </TabsList>

          {/* Wallets Tab */}
          <TabsContent value="wallets" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Wallet className="h-5 w-5" />
                  Wallet Management
                </CardTitle>
                <CardDescription>Flexible wallet options for all user types</CardDescription>
              </CardHeader>
              <CardContent className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <h3 className="font-semibold">Custodial Wallets</h3>
                  <p className="text-sm text-muted-foreground">
                    Bank-managed wallets with multi-signature security, automated backups, and recovery support.
                  </p>
                </div>
                <div className="space-y-2">
                  <h3 className="font-semibold">Non-Custodial Wallets</h3>
                  <p className="text-sm text-muted-foreground">
                    User-controlled wallets with private key ownership, hardware wallet support, and self-custody.
                  </p>
                </div>
                <div className="space-y-2">
                  <h3 className="font-semibold">Multi-Currency Support</h3>
                  <p className="text-sm text-muted-foreground">
                    Support for EGP, USD, SAR, and Pi Network with real-time FX conversion and rate tracking.
                  </p>
                </div>
                <div className="space-y-2">
                  <h3 className="font-semibold">Wallet Permissions</h3>
                  <p className="text-sm text-muted-foreground">
                    Role-based access with spending limits, transaction types, and approval requirements.
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Transactions Tab */}
          <TabsContent value="transactions" className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <Zap className="h-5 w-5 text-primary" />
                    <CardTitle>Instant Transfers</CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="space-y-2 text-sm text-muted-foreground">
                  <p>• Real-time Pi Network transfers</p>
                  <p>• Bank-to-bank instant payments</p>
                  <p>• Cross-currency settlements</p>
                  <p>• Batch transaction processing</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <FileCheck className="h-5 w-5 text-primary" />
                    <CardTitle>Multi-Tier Approval</CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="space-y-2 text-sm text-muted-foreground">
                  <p>• Tier 1: Operations approval (&lt;$1K)</p>
                  <p>• Tier 2: Compliance review ($1K-$10K)</p>
                  <p>• Tier 3: Admin authorization (&gt;$10K)</p>
                  <p>• Automated routing by amount</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <DollarSign className="h-5 w-5 text-primary" />
                    <CardTitle>FX & Conversion</CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="space-y-2 text-sm text-muted-foreground">
                  <p>• Live FX rates from multiple providers</p>
                  <p>• Automatic currency conversion</p>
                  <p>• Historical rate tracking</p>
                  <p>• Slippage protection</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <Activity className="h-5 w-5 text-primary" />
                    <CardTitle>Settlement Rails</CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="space-y-2 text-sm text-muted-foreground">
                  <p>• Bank transfer networks</p>
                  <p>• Agent-based cash settlements</p>
                  <p>• On/off-ramp flows</p>
                  <p>• Configurable cutoff times</p>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Compliance Tab */}
          <TabsContent value="compliance" className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <Shield className="h-5 w-5 text-primary" />
                    <CardTitle>KYC/AML</CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="space-y-2 text-sm text-muted-foreground">
                  <p>• Automated identity verification</p>
                  <p>• Document upload & validation</p>
                  <p>• Risk scoring algorithms</p>
                  <p>• Enhanced due diligence (EDD)</p>
                  <p>• Ongoing monitoring</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <Globe2 className="h-5 w-5 text-primary" />
                    <CardTitle>Sanctions Screening</CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="space-y-2 text-sm text-muted-foreground">
                  <p>• OFAC list screening</p>
                  <p>• EU sanctions database</p>
                  <p>• UN sanctions lists</p>
                  <p>• Real-time automated checks</p>
                  <p>• Match resolution workflows</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <FileCheck className="h-5 w-5 text-primary" />
                    <CardTitle>Audit Logging</CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="space-y-2 text-sm text-muted-foreground">
                  <p>• Append-only signed logs</p>
                  <p>• Cryptographic chain verification</p>
                  <p>• CSV/JSON export formats</p>
                  <p>• Tamper detection</p>
                  <p>• Regulator-ready reports</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <BarChart3 className="h-5 w-5 text-primary" />
                    <CardTitle>Transaction Monitoring</CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="space-y-2 text-sm text-muted-foreground">
                  <p>• Real-time risk scoring</p>
                  <p>• Suspicious activity alerts</p>
                  <p>• Pattern detection ML models</p>
                  <p>• Alert investigation workflows</p>
                  <p>• SAR filing support</p>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Enterprise Tab */}
          <TabsContent value="enterprise" className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <Users className="h-5 w-5 text-primary" />
                    <CardTitle>Role-Based Access</CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="space-y-2 text-sm text-muted-foreground">
                  <p>• 6 predefined roles (Admin, Compliance, Ops, Business, Individual, Agent)</p>
                  <p>• Granular permission controls</p>
                  <p>• Transaction limit enforcement</p>
                  <p>• Audit trail per user action</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <BarChart3 className="h-5 w-5 text-primary" />
                    <CardTitle>Treasury Dashboard</CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="space-y-2 text-sm text-muted-foreground">
                  <p>• Daily reconciliation tracking</p>
                  <p>• Settlement rail configuration</p>
                  <p>• Cutoff time management</p>
                  <p>• Liquidity monitoring</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <Activity className="h-5 w-5 text-primary" />
                    <CardTitle>Observability</CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="space-y-2 text-sm text-muted-foreground">
                  <p>• Prometheus metrics collection</p>
                  <p>• Grafana dashboards</p>
                  <p>• Sentry error tracking</p>
                  <p>• ELK/Loki logging</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <Smartphone className="h-5 w-5 text-primary" />
                    <CardTitle>Mobile Banking</CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="space-y-2 text-sm text-muted-foreground">
                  <p>• Native Android & iOS apps</p>
                  <p>• Offline mode with sync</p>
                  <p>• Push notifications</p>
                  <p>• Biometric + PIN authentication</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <Lock className="h-5 w-5 text-primary" />
                    <CardTitle>Security</CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="space-y-2 text-sm text-muted-foreground">
                  <p>• HTTPS/TLS 1.3 encryption</p>
                  <p>• JWT with OIDC authentication</p>
                  <p>• Request signing (HMAC)</p>
                  <p>• Rate limiting & WAF</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <Globe2 className="h-5 w-5 text-primary" />
                    <CardTitle>Regional Support</CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="space-y-2 text-sm text-muted-foreground">
                  <p>• Multi-language (Arabic/English)</p>
                  <p>• Local payment methods</p>
                  <p>• Regional compliance</p>
                  <p>• GCC market focus</p>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>

        {/* Call to Action */}
        <Card className="bg-primary/5 border-primary/20">
          <CardContent className="py-8 text-center space-y-4">
            <h2 className="text-2xl font-bold">Ready to Get Started?</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Join the future of banking with TEOS BankChain. Contact us to learn more about enterprise deployment and
              regional partnerships.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
              <a
                href="mailto:ayman@teosegypt.com"
                className="inline-flex items-center justify-center rounded-md bg-primary px-6 py-3 text-sm font-medium text-primary-foreground hover:bg-primary/90"
              >
                Contact Sales
              </a>
              <a
                href="/login"
                className="inline-flex items-center justify-center rounded-md border border-input bg-background px-6 py-3 text-sm font-medium hover:bg-accent hover:text-accent-foreground"
              >
                Try Demo
              </a>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
