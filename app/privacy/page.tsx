import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"

export default function PrivacyPage() {
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
          <h1 className="text-4xl font-bold mb-2">Privacy Policy</h1>
          <p className="text-muted-foreground mb-8">Effective Date: December 2, 2025 | Version 1.0</p>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">1. Introduction</h2>
            <p>
              TEOS BankChain ("we," "us," "our") is committed to protecting your privacy. This Privacy Policy explains
              how we collect, use, disclose, and safeguard your personal information when you use our digital banking
              platform built on Pi Network, serving customers in Egypt and the MENA region.
            </p>
            <p className="mt-3">By using TEOS BankChain, you consent to the data practices described in this policy.</p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">2. Information We Collect</h2>

            <h3 className="text-xl font-semibold mb-3 mt-4">2.1 Personal Information</h3>
            <ul className="list-disc pl-6 space-y-2">
              <li>
                <strong>Identity Data:</strong> Full name, date of birth, government-issued ID number, nationality
              </li>
              <li>
                <strong>Contact Data:</strong> Email address, phone number, physical address
              </li>
              <li>
                <strong>Financial Data:</strong> Bank account details, transaction history, card information
              </li>
              <li>
                <strong>Pi Network Data:</strong> Pi wallet address, username, transaction records
              </li>
              <li>
                <strong>KYC Documents:</strong> Passport/national ID scans, proof of address, selfie verification
              </li>
            </ul>

            <h3 className="text-xl font-semibold mb-3 mt-4">2.2 Technical Information</h3>
            <ul className="list-disc pl-6 space-y-2">
              <li>IP address, device type, browser information</li>
              <li>Mobile device identifiers (Android/iOS)</li>
              <li>Location data (with your permission)</li>
              <li>App usage patterns and session logs</li>
              <li>Biometric data (fingerprint/Face ID) if you enable this feature</li>
            </ul>

            <h3 className="text-xl font-semibold mb-3 mt-4">2.3 Transaction Data</h3>
            <ul className="list-disc pl-6 space-y-2">
              <li>Payment amounts, dates, and recipient information</li>
              <li>ISO-20022 transaction references</li>
              <li>Currency exchange rates and FX transactions</li>
              <li>Card purchases and ATM withdrawals</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">3. How We Use Your Information</h2>
            <p className="mb-3">We use your personal information for:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>
                <strong>Account Management:</strong> Creating and maintaining your TEOS BankChain account
              </li>
              <li>
                <strong>KYC/AML Compliance:</strong> Verifying identity, screening sanctions lists, monitoring
                transactions
              </li>
              <li>
                <strong>Transaction Processing:</strong> Executing transfers, card payments, and FX conversions
              </li>
              <li>
                <strong>Security:</strong> Preventing fraud, detecting unauthorized access, protecting against threats
              </li>
              <li>
                <strong>Customer Support:</strong> Responding to inquiries, resolving disputes, providing assistance
              </li>
              <li>
                <strong>Legal Obligations:</strong> Complying with Egyptian Central Bank (CBE) regulations and MENA
                financial laws
              </li>
              <li>
                <strong>Service Improvement:</strong> Analyzing usage patterns to enhance platform features
              </li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">4. Data Sharing & Disclosure</h2>
            <p className="mb-3">We may share your information with:</p>

            <div className="bg-muted/50 p-4 rounded-lg mb-4">
              <h3 className="font-semibold mb-2">4.1 Service Providers</h3>
              <ul className="list-disc pl-6 space-y-1">
                <li>KYC verification partners (e.g., Onfido, Jumio)</li>
                <li>Payment processors and card issuers</li>
                <li>Cloud infrastructure providers (AWS, Google Cloud)</li>
                <li>SMS/email notification services</li>
              </ul>
            </div>

            <div className="bg-muted/50 p-4 rounded-lg mb-4">
              <h3 className="font-semibold mb-2">4.2 Regulatory Authorities</h3>
              <ul className="list-disc pl-6 space-y-1">
                <li>Egyptian Central Bank (CBE)</li>
                <li>MENA region financial regulators</li>
                <li>Law enforcement agencies (when legally required)</li>
                <li>Tax authorities for reporting purposes</li>
              </ul>
            </div>

            <div className="bg-muted/50 p-4 rounded-lg">
              <h3 className="font-semibold mb-2">4.3 Third Parties (With Your Consent)</h3>
              <ul className="list-disc pl-6 space-y-1">
                <li>Partner banks for account linking</li>
                <li>Merchants for transaction confirmation</li>
              </ul>
            </div>

            <p className="mt-4">
              We <strong>never</strong> sell your personal information to third parties for marketing purposes.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">5. Data Security</h2>
            <p className="mb-3">We implement industry-leading security measures:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>
                <strong>Encryption:</strong> AES-256 encryption for data at rest, TLS 1.3 for data in transit
              </li>
              <li>
                <strong>Access Controls:</strong> Role-based access (RBAC) with least-privilege principle
              </li>
              <li>
                <strong>Audit Logging:</strong> Immutable, signed logs of all system activities
              </li>
              <li>
                <strong>Regular Audits:</strong> Third-party security assessments and penetration testing
              </li>
              <li>
                <strong>Secure Infrastructure:</strong> ISO 27001 certified cloud providers
              </li>
              <li>
                <strong>Incident Response:</strong> 24/7 monitoring with breach notification within 72 hours
              </li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">6. Data Retention</h2>
            <p>We retain your personal information for as long as your account is active, plus:</p>
            <ul className="list-disc pl-6 space-y-2 mt-3">
              <li>
                <strong>Transaction Records:</strong> 7 years (CBE requirement)
              </li>
              <li>
                <strong>KYC Documents:</strong> 5 years after account closure
              </li>
              <li>
                <strong>Audit Logs:</strong> 10 years (regulatory compliance)
              </li>
              <li>
                <strong>Marketing Data:</strong> Until you opt out or 2 years of inactivity
              </li>
            </ul>
            <p className="mt-3">
              You may request account deletion at any time, subject to legal retention requirements.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">7. Your Rights</h2>
            <p className="mb-3">You have the right to:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>
                <strong>Access:</strong> Request a copy of your personal data
              </li>
              <li>
                <strong>Correction:</strong> Update inaccurate or incomplete information
              </li>
              <li>
                <strong>Deletion:</strong> Request account deletion (subject to legal obligations)
              </li>
              <li>
                <strong>Portability:</strong> Export your data in machine-readable format (JSON/CSV)
              </li>
              <li>
                <strong>Objection:</strong> Opt out of marketing communications
              </li>
              <li>
                <strong>Restriction:</strong> Limit processing of your data in certain circumstances
              </li>
            </ul>
            <p className="mt-3">
              To exercise these rights, contact us at ayman@teosegypt.com or via the in-app support system.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">8. International Data Transfers</h2>
            <p>
              Your data may be transferred to and stored in countries outside Egypt for cloud infrastructure purposes.
              We ensure adequate protections through standard contractual clauses and compliance with GDPR-equivalent
              standards where applicable.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">9. Cookies & Tracking</h2>
            <p className="mb-3">We use cookies and similar technologies to:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Maintain your login session</li>
              <li>Remember your preferences (language, theme)</li>
              <li>Analyze platform usage for improvements</li>
              <li>Detect and prevent fraud</li>
            </ul>
            <p className="mt-3">You can manage cookie preferences in your browser settings or app preferences.</p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">10. Children's Privacy</h2>
            <p>
              TEOS BankChain is not intended for users under 18 years old. We do not knowingly collect personal
              information from minors. If we discover such data, we will delete it immediately.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">11. Changes to This Policy</h2>
            <p>
              We may update this Privacy Policy to reflect changes in our practices or legal requirements. Users will be
              notified via email 30 days before significant changes take effect. Continued use of the Platform
              constitutes acceptance of the updated policy.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">12. Contact Us</h2>
            <div className="bg-muted/50 p-4 rounded-lg">
              <p className="mb-2">For privacy-related inquiries, data requests, or to report a security concern:</p>
              <p>
                <strong>TEOS Egypt (Elmahrosa International)</strong>
              </p>
              <p>Privacy Officer: Ayman Fathy</p>
              <p>Email: ayman@teosegypt.com</p>
              <p>Website: bankchain.teosegypt.com</p>
              <p>WhatsApp: +201006167293</p>
              <p>Address: Cairo, Egypt</p>
            </div>
          </section>

          <div className="border-t pt-6 mt-8">
            <p className="text-sm text-muted-foreground">Last Updated: December 2, 2025 | Version 1.0</p>
            <p className="text-sm text-muted-foreground mt-2">
              This policy complies with Egyptian Data Protection Law and GDPR principles for international operations.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
