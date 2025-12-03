"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Building2, Shield, Zap, Globe, Lock, Smartphone, CheckCircle2 } from "lucide-react"
import { ContactBadge } from "@/components/contact-badge"

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
      <div className="container max-w-6xl mx-auto px-4 py-8 space-y-8">
        {/* Hero Section */}
        <div className="text-center space-y-4 py-8">
          <Badge className="bg-primary text-primary-foreground">Next-Generation Digital Banking</Badge>
          <h1 className="text-4xl md:text-5xl font-bold text-balance">TEOS BankChain</h1>
          <p className="text-xl text-muted-foreground text-balance max-w-3xl mx-auto">
            A next-generation digital banking layer built on the Pi Network delivering secure, compliant, and instant
            financial services for Egypt and the MENA region.
          </p>
        </div>

        {/* Vision Statement */}
        <Card className="border-primary/20">
          <CardHeader>
            <CardTitle className="text-2xl">Our Vision</CardTitle>
            <CardDescription>Building the future of banking on Pi Network</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-lg leading-relaxed">
              TEOS BankChain is a next-generation digital banking layer built on the Pi Network. It delivers secure KYC,
              AML, sanctions screening, ISO-20022 transactions, and Pi-powered identity. The platform includes a mobile
              banking app, real-time IoT data integration, and a compliant financial engine designed for Egypt and the
              MENA region.
            </p>
            <p className="text-lg leading-relaxed">
              TEOS BankChain enables instant transfers, user verification, and encrypted sessions with MFA support. Our
              platform presents TEOS BankChain as a trusted Pi-based digital bank ready for scale.
            </p>
          </CardContent>
        </Card>

        {/* Core Features Grid */}
        <div className="grid md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <Shield className="h-6 w-6 text-primary" />
                </div>
                <CardTitle>Secure & Compliant</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex items-start gap-2">
                <CheckCircle2 className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                <span>KYC/AML verification and continuous monitoring</span>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle2 className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                <span>Automated sanctions screening (OFAC/EU/UN)</span>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle2 className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                <span>ISO-20022 compliant transactions</span>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle2 className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                <span>Append-only signed audit logs</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <Zap className="h-6 w-6 text-primary" />
                </div>
                <CardTitle>Instant Transactions</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex items-start gap-2">
                <CheckCircle2 className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                <span>Real-time transfers powered by Pi Network</span>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle2 className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                <span>Multi-currency support (EGP/USD/SAR/PI)</span>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle2 className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                <span>Live FX rates with configurable providers</span>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle2 className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                <span>Settlement rails with bank & agent networks</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <Lock className="h-6 w-6 text-primary" />
                </div>
                <CardTitle>Pi-Powered Identity</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex items-start gap-2">
                <CheckCircle2 className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                <span>Seamless Pi Browser integration</span>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle2 className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                <span>Biometric authentication (Face ID/Fingerprint)</span>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle2 className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                <span>MFA support for enhanced security</span>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle2 className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                <span>Encrypted sessions with auto-timeout</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <Smartphone className="h-6 w-6 text-primary" />
                </div>
                <CardTitle>Mobile Banking</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex items-start gap-2">
                <CheckCircle2 className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                <span>Native Android & iOS apps</span>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle2 className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                <span>Offline mode with encrypted storage</span>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle2 className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                <span>Push notifications for transactions</span>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle2 className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                <span>Real-time IoT data integration</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <Building2 className="h-6 w-6 text-primary" />
                </div>
                <CardTitle>Enterprise-Grade</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex items-start gap-2">
                <CheckCircle2 className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                <span>Role-based access control (RBAC)</span>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle2 className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                <span>Multi-tier approval workflows</span>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle2 className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                <span>Treasury dashboard with reconciliation</span>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle2 className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                <span>SLA monitoring and uptime tracking</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <Globe className="h-6 w-6 text-primary" />
                </div>
                <CardTitle>MENA Region Focus</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex items-start gap-2">
                <CheckCircle2 className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                <span>Designed for Egypt and GCC markets</span>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle2 className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                <span>Multi-language support (Arabic/English)</span>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle2 className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                <span>Local payment methods integration</span>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle2 className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                <span>Regional compliance frameworks</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Technology Stack */}
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">Technology Stack</CardTitle>
            <CardDescription>Built with modern, scalable technologies</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid md:grid-cols-3 gap-4">
              <div>
                <h3 className="font-semibold mb-2">Frontend</h3>
                <ul className="space-y-1 text-sm text-muted-foreground">
                  <li>• Next.js 14 with App Router</li>
                  <li>• React 18 with TypeScript</li>
                  <li>• Tailwind CSS v4</li>
                  <li>• shadcn/ui components</li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold mb-2">Backend</h3>
                <ul className="space-y-1 text-sm text-muted-foreground">
                  <li>• FastAPI (Python 3.11+)</li>
                  <li>• PostgreSQL 14+</li>
                  <li>• Redis for caching</li>
                  <li>• WebSocket support</li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold mb-2">Mobile</h3>
                <ul className="space-y-1 text-sm text-muted-foreground">
                  <li>• Capacitor for Android/iOS</li>
                  <li>• Native biometric APIs</li>
                  <li>• Encrypted local storage</li>
                  <li>• Push notifications</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Security & Compliance */}
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">Security & Compliance</CardTitle>
            <CardDescription>Enterprise-grade security with regulatory compliance</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <h3 className="font-semibold">Security Features</h3>
                <ul className="space-y-1 text-sm text-muted-foreground">
                  <li>• HTTPS/TLS 1.3 encryption</li>
                  <li>• JWT with OIDC authentication</li>
                  <li>• Request signing (HMAC SHA-256)</li>
                  <li>• Rate limiting & WAF protection</li>
                  <li>• Secrets management (Vault)</li>
                  <li>• Automated security scanning</li>
                </ul>
              </div>
              <div className="space-y-2">
                <h3 className="font-semibold">Compliance Features</h3>
                <ul className="space-y-1 text-sm text-muted-foreground">
                  <li>• KYC/AML verification workflows</li>
                  <li>• Sanctions screening automation</li>
                  <li>• Transaction monitoring & alerts</li>
                  <li>• Audit logs (CSV/JSON export)</li>
                  <li>• Regulatory reporting tools</li>
                  <li>• ISO-20022 standards</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Contact & Support */}
        <div className="flex justify-center">
          <ContactBadge />
        </div>
      </div>
    </div>
  )
}
