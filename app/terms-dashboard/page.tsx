"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowLeft, Shield, FileText, Lock, Download, History, AlertTriangle, CheckCircle } from "lucide-react"
import Link from "next/link"
import { useAuth } from "@/contexts/auth-context"
import { LegalDocsService, type LegalDocument } from "@/lib/legal-docs-service"
import { useToast } from "@/hooks/use-toast"

export default function TermsDashboardPage() {
  const { user } = useAuth()
  const { toast } = useToast()
  const [documents, setDocuments] = useState<LegalDocument[]>([])
  const [selectedDoc, setSelectedDoc] = useState<LegalDocument | null>(null)
  const [loading, setLoading] = useState(true)
  const [escalationOpen, setEscalationOpen] = useState(false)
  const [escalationIssue, setEscalationIssue] = useState("")
  const [escalationUrgency, setEscalationUrgency] = useState<"low" | "medium" | "high" | "critical">("medium")

  // Check if user is founder/admin
  const isFounder = user?.role === "bank_admin" || user?.role === "compliance_officer"

  useEffect(() => {
    loadDocuments()
  }, [])

  const loadDocuments = async () => {
    setLoading(true)
    try {
      const docs = await LegalDocsService.getAllDocuments()
      setDocuments(docs)
    } catch (error) {
      console.error("[v0] Error loading documents:", error)
      toast({
        title: "Error",
        description: "Failed to load legal documents",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleExportPDF = async (doc: LegalDocument) => {
    try {
      toast({
        title: "Exporting...",
        description: "Generating PDF export",
      })
      const blob = await LegalDocsService.exportToPDF(doc.id)
      LegalDocsService.downloadFile(blob, `${doc.type}-${doc.version}.pdf`)
      toast({
        title: "Export Complete",
        description: "PDF has been downloaded",
      })
    } catch (error) {
      toast({
        title: "Export Failed",
        description: "Could not export document",
        variant: "destructive",
      })
    }
  }

  const handleExportCSV = async (doc: LegalDocument) => {
    try {
      toast({
        title: "Exporting...",
        description: "Generating CSV export for regulators",
      })
      const blob = await LegalDocsService.exportToCSV(doc.id)
      LegalDocsService.downloadFile(blob, `${doc.type}-${doc.version}.csv`)
      toast({
        title: "Export Complete",
        description: "CSV has been downloaded",
      })
    } catch (error) {
      toast({
        title: "Export Failed",
        description: "Could not export document",
        variant: "destructive",
      })
    }
  }

  const handleCreateTicket = async () => {
    if (!escalationIssue.trim()) {
      toast({
        title: "Required",
        description: "Please describe the issue",
        variant: "destructive",
      })
      return
    }

    try {
      await LegalDocsService.createLegalTicket({
        documentType: selectedDoc?.type || "general",
        issue: escalationIssue,
        userRole: user?.role || "individual",
        urgency: escalationUrgency,
      })

      toast({
        title: "Ticket Created",
        description: "Your legal inquiry has been escalated to the compliance team",
      })

      setEscalationOpen(false)
      setEscalationIssue("")
      setEscalationUrgency("medium")
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create support ticket",
        variant: "destructive",
      })
    }
  }

  // Filter documents based on role
  const visibleDocuments = isFounder
    ? documents
    : documents.filter((doc) => doc.type !== "license" && doc.type !== "compliance")

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white dark:from-slate-950 dark:to-slate-900 p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <Link href={isFounder ? "/founder-dashboard" : "/client-dashboard"}>
            <Button variant="ghost" className="mb-4">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Dashboard
            </Button>
          </Link>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-blue-900 to-blue-600 bg-clip-text text-transparent">
                {isFounder ? "Legal Documents Management" : "Terms & Legal Documents"}
              </h1>
              <p className="text-slate-600 dark:text-slate-400">
                {isFounder
                  ? "Manage legal documentation, track versions, and export for regulators"
                  : "TEOS BankChain legal documentation and compliance information"}
              </p>
            </div>
            {isFounder && (
              <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                Admin View
              </Badge>
            )}
          </div>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
          {visibleDocuments.map((doc) => (
            <Card key={doc.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                {doc.type === "terms" && <Shield className="h-8 w-8 text-blue-600 mb-2" />}
                {doc.type === "privacy" && <Lock className="h-8 w-8 text-amber-600 mb-2" />}
                {doc.type === "compliance" && <CheckCircle className="h-8 w-8 text-emerald-600 mb-2" />}
                {doc.type === "license" && <FileText className="h-8 w-8 text-purple-600 mb-2" />}
                <CardTitle className="text-lg">{doc.title}</CardTitle>
                <CardDescription>
                  Version {doc.version} • {doc.status}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="text-sm text-slate-600 dark:text-slate-400">
                  <p>Updated: {doc.lastUpdated}</p>
                  <p>Review: {doc.nextReview}</p>
                </div>

                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1 bg-transparent"
                    onClick={() => setSelectedDoc(doc)}
                  >
                    <History className="mr-2 h-4 w-4" />
                    Changelog
                  </Button>

                  {isFounder && (
                    <>
                      <Button variant="outline" size="sm" onClick={() => handleExportPDF(doc)}>
                        <Download className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => handleExportCSV(doc)}>
                        CSV
                      </Button>
                    </>
                  )}
                </div>

                {!isFounder && (
                  <Link href={`/${doc.type}`}>
                    <Button variant="outline" className="w-full bg-transparent">
                      <FileText className="mr-2 h-4 w-4" />
                      Read Full Document
                    </Button>
                  </Link>
                )}
              </CardContent>
            </Card>
          ))}
        </div>

        <Dialog open={!!selectedDoc} onOpenChange={() => setSelectedDoc(null)}>
          <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{selectedDoc?.title} - Version History</DialogTitle>
              <DialogDescription>Complete changelog and update history</DialogDescription>
            </DialogHeader>

            <div className="space-y-4 mt-4">
              {selectedDoc?.changelog.map((entry, index) => (
                <Card key={index} className="border-l-4 border-l-blue-600">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle className="text-lg">Version {entry.version}</CardTitle>
                        <CardDescription>
                          {entry.date} • {entry.author}
                        </CardDescription>
                      </div>
                      <Badge
                        variant={
                          entry.impactLevel === "major"
                            ? "destructive"
                            : entry.impactLevel === "minor"
                              ? "default"
                              : "secondary"
                        }
                      >
                        {entry.impactLevel}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <ul className="list-disc list-inside space-y-1 text-sm">
                      {entry.changes.map((change, i) => (
                        <li key={i}>{change}</li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              ))}
            </div>
          </DialogContent>
        </Dialog>

        <Card className="mb-8 bg-gradient-to-r from-amber-50 to-amber-100 dark:from-amber-950 dark:to-amber-900 border-amber-200 dark:border-amber-800">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5" />
              Questions or Concerns?
            </CardTitle>
            <CardDescription>Create a support ticket for legal or compliance inquiries</CardDescription>
          </CardHeader>
          <CardContent>
            <Dialog open={escalationOpen} onOpenChange={setEscalationOpen}>
              <DialogTrigger asChild>
                <Button variant="outline" className="bg-white dark:bg-slate-900">
                  <AlertTriangle className="mr-2 h-4 w-4" />
                  Escalate to Legal Team
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Create Legal Support Ticket</DialogTitle>
                  <DialogDescription>
                    Your inquiry will be routed to our legal and compliance team per SUPPORT.md guidelines
                  </DialogDescription>
                </DialogHeader>

                <div className="space-y-4 mt-4">
                  <div>
                    <label className="text-sm font-medium mb-2 block">Urgency Level</label>
                    <Select value={escalationUrgency} onValueChange={(v: any) => setEscalationUrgency(v)}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="low">Low - General inquiry</SelectItem>
                        <SelectItem value="medium">Medium - Clarification needed</SelectItem>
                        <SelectItem value="high">High - Compliance concern</SelectItem>
                        <SelectItem value="critical">Critical - Regulatory issue</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <label className="text-sm font-medium mb-2 block">Describe Your Issue</label>
                    <Textarea
                      placeholder="Please provide details about your legal or compliance question..."
                      value={escalationIssue}
                      onChange={(e) => setEscalationIssue(e.target.value)}
                      rows={5}
                    />
                  </div>

                  <Button onClick={handleCreateTicket} className="w-full">
                    Submit Ticket
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-950 dark:to-blue-900 border-blue-200 dark:border-blue-800">
          <CardHeader>
            <CardTitle>Contact Legal & Compliance Team</CardTitle>
            <CardDescription>Direct contact for urgent matters</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <p className="text-sm">
              <strong>Legal Inquiries:</strong> legal@teosegypt.com
            </p>
            <p className="text-sm">
              <strong>Support:</strong> ayman@teosegypt.com
            </p>
            <p className="text-sm">
              <strong>WhatsApp:</strong> +201006167293
            </p>
            <p className="text-sm">
              <strong>Website:</strong> bankchain.teosegypt.com
            </p>
            <p className="text-xs text-slate-600 dark:text-slate-400 mt-4">
              For ticket escalation paths and SLA targets, refer to SUPPORT.md
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
