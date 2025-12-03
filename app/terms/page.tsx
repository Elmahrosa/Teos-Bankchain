import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container max-w-4xl mx-auto py-12 px-4">
        <Link href="/login">
          <Button variant="ghost" className="mb-6">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Login
          </Button>
        </Link>

        <div className="prose prose-slate dark:prose-invert max-w-none">
          <h1 className="text-4xl font-bold mb-2">Terms of Service</h1>
          <p className="text-muted-foreground mb-8">Effective Date: December 2, 2025 | Version 1.0</p>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">1. Acceptance of Terms</h2>
            <p>
              By accessing or using TEOS BankChain ("Platform"), you agree to be bound by these Terms of Service. TEOS
              BankChain is a digital banking platform built on Pi Network that bridges traditional banking with
              blockchain technology, serving customers in Egypt and the MENA region.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">2. Eligibility & Account Requirements</h2>
            <p className="mb-3">To use TEOS BankChain, you must:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Be at least 18 years old</li>
              <li>Have a verified Pi Network account</li>
              <li>Complete KYC (Know Your Customer) verification with valid government-issued ID</li>
              <li>Provide accurate personal and contact information</li>
              <li>Comply with Egyptian Central Bank (CBE) and MENA region financial regulations</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">3. Services Provided</h2>
            <p className="mb-3">TEOS BankChain offers:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>
                <strong>Pi Wallet Integration:</strong> Secure linking of your Pi Network wallet
              </li>
              <li>
                <strong>Multi-Currency Support:</strong> EGP, SAR, AED, USD, EUR, and Pi cryptocurrency
              </li>
              <li>
                <strong>Card Issuance:</strong> Virtual and physical debit cards (subject to KYC approval)
              </li>
              <li>
                <strong>Instant Transfers:</strong> ISO-20022 compliant transactions with real-time settlement
              </li>
              <li>
                <strong>Real-Time FX:</strong> Multi-currency exchange at competitive rates
              </li>
              <li>
                <strong>Mobile Banking:</strong> Full-featured mobile app for iOS and Android
              </li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">4. KYC/AML Compliance</h2>
            <p className="mb-3">TEOS BankChain is committed to preventing financial crimes. All users must:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Complete identity verification (KYC) within 30 days of account creation</li>
              <li>Submit valid government-issued identification documents</li>
              <li>Undergo sanctions screening (OFAC, UN, EU lists)</li>
              <li>Provide proof of address and source of funds for transactions exceeding thresholds</li>
              <li>Consent to ongoing transaction monitoring for anti-money laundering (AML) purposes</li>
            </ul>
            <p className="mt-3">
              Failure to complete KYC verification will result in limited account functionality. Accounts flagged during
              sanctions screening will be suspended pending investigation.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">5. Fees & Transaction Limits</h2>
            <div className="bg-muted/50 p-4 rounded-lg mb-4">
              <h3 className="font-semibold mb-2">Transaction Fees:</h3>
              <ul className="list-disc pl-6 space-y-1">
                <li>Domestic transfers (Egypt): 0.5% (min EGP 5, max EGP 100)</li>
                <li>MENA transfers: 1% (min equivalent EGP 10)</li>
                <li>International transfers: 1.5% + FX spread</li>
                <li>Card issuance: EGP 50 (virtual), EGP 150 (physical)</li>
                <li>ATM withdrawal (domestic): EGP 10 per transaction</li>
              </ul>
            </div>
            <div className="bg-muted/50 p-4 rounded-lg">
              <h3 className="font-semibold mb-2">Transaction Limits:</h3>
              <ul className="list-disc pl-6 space-y-1">
                <li>Daily transfer limit: EGP 50,000 (KYC-verified)</li>
                <li>Monthly transfer limit: EGP 500,000 (KYC-verified)</li>
                <li>Card spending limit: EGP 100,000/month</li>
              </ul>
            </div>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">6. Security & User Responsibilities</h2>
            <p className="mb-3">You are responsible for:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Maintaining the security of your Pi Wallet credentials</li>
              <li>Enabling multi-factor authentication (MFA) when available</li>
              <li>Reporting unauthorized transactions within 24 hours</li>
              <li>Keeping your contact information (email, phone) up to date</li>
              <li>Not sharing account access with third parties</li>
            </ul>
            <p className="mt-3">
              TEOS BankChain employs bank-grade encryption (AES-256), secure session management, and regular security
              audits to protect your data.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">7. Prohibited Activities</h2>
            <p className="mb-3">Users may not use TEOS BankChain for:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Money laundering or terrorist financing</li>
              <li>Fraudulent transactions or identity theft</li>
              <li>Transactions with sanctioned individuals or entities</li>
              <li>Illegal gambling or adult entertainment services</li>
              <li>Unauthorized business activities without proper licensing</li>
            </ul>
            <p className="mt-3">
              Violation of these terms may result in immediate account suspension and reporting to authorities.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">8. Liability & Dispute Resolution</h2>
            <p>
              TEOS BankChain is not liable for losses resulting from user error, unauthorized access due to credential
              sharing, or third-party service failures. Disputes must be reported within 60 days and will be resolved
              through mediation before legal proceedings. Egyptian law governs these terms.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">9. Changes to Terms</h2>
            <p>
              TEOS BankChain reserves the right to modify these Terms at any time. Users will be notified via email 30
              days before changes take effect. Continued use of the Platform constitutes acceptance of updated Terms.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">10. Contact Information</h2>
            <div className="bg-muted/50 p-4 rounded-lg">
              <p>
                <strong>TEOS Egypt (Elmahrosa International)</strong>
              </p>
              <p>Email: ayman@teosegypt.com</p>
              <p>Website: bankchain.teosegypt.com</p>
              <p>WhatsApp: +201006167293</p>
              <p>Address: Cairo, Egypt</p>
            </div>
          </section>

          <div className="border-t pt-6 mt-8">
            <p className="text-sm text-muted-foreground">Last Updated: December 2, 2025 | Version 1.0</p>
          </div>
        </div>
      </div>
    </div>
  )
}
