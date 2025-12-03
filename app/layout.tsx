import type React from "react"
import type { Metadata } from "next"
import { GeistSans } from "geist/font/sans"
import { GeistMono } from "geist/font/mono"
import { AuthProvider } from "@/contexts/auth-context"
import { AIChatAssistant } from "@/components/ai-chat-assistant"
import Script from "next/script"
import "./globals.css"

export const metadata: Metadata = {
  title: "TEOS BankChain - Pi Network Banking",
  description: "Secure digital banking powered by Pi Network. KYC/AML compliant for MENA region.",
  manifest: "/manifest.json",
    generator: 'v0.app'
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <head>
        <Script src="https://sdk.minepi.com/pi-sdk.js" strategy="beforeInteractive" />
        <style>{`
html {
  font-family: ${GeistSans.style.fontFamily};
  --font-sans: ${GeistSans.variable};
  --font-mono: ${GeistMono.variable};
}
        `}</style>
      </head>
      <body>
        <AuthProvider>
          {children}
          <AIChatAssistant />
        </AuthProvider>
      </body>
    </html>
  )
}
