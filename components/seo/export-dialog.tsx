"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Card, CardContent } from "@/components/ui/card"
import { ReportGenerator, downloadReport, generateReportFilename, type ReportOptions } from "@/lib/report-generator"
import type { SEOAuditResult } from "@/lib/types"
import { Download, FileText, Database, Table } from "lucide-react"

interface ExportDialogProps {
  auditResult: SEOAuditResult
  children?: React.ReactNode
}

export function ExportDialog({ auditResult, children }: ExportDialogProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [isGenerating, setIsGenerating] = useState(false)
  const [options, setOptions] = useState<ReportOptions>({
    format: "pdf",
    includeScreenshot: true,
    includeInsights: true,
    includeIssues: true,
    template: "comprehensive",
  })

  const handleExport = async () => {
    setIsGenerating(true)
    try {
      const reportBlob = await ReportGenerator.generateReport(auditResult, options)
      const filename = generateReportFilename(auditResult, options.format)
      downloadReport(reportBlob, filename)
      setIsOpen(false)
    } catch (error) {
      console.error("Export failed:", error)
      // In a real app, you'd show a toast notification here
    } finally {
      setIsGenerating(false)
    }
  }

  const formatIcons = {
    pdf: <FileText className="w-4 h-4" />,
    json: <Database className="w-4 h-4" />,
    csv: <Table className="w-4 h-4" />,
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {children || (
          <Button variant="outline" size="sm">
            <Download className="w-4 h-4 mr-2" />
            Export Report
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Export SEO Report</DialogTitle>
          <DialogDescription>Choose your preferred format and options for the audit report.</DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Format Selection */}
          <div className="space-y-2">
            <Label>Export Format</Label>
            <Select
              value={options.format}
              onValueChange={(value: "pdf" | "json" | "csv") => setOptions((prev) => ({ ...prev, format: value }))}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="pdf">
                  <div className="flex items-center gap-2">
                    {formatIcons.pdf}
                    PDF Report
                  </div>
                </SelectItem>
                <SelectItem value="json">
                  <div className="flex items-center gap-2">
                    {formatIcons.json}
                    JSON Data
                  </div>
                </SelectItem>
                <SelectItem value="csv">
                  <div className="flex items-center gap-2">
                    {formatIcons.csv}
                    CSV Spreadsheet
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Template Selection (PDF only) */}
          {options.format === "pdf" && (
            <div className="space-y-2">
              <Label>Report Template</Label>
              <Select
                value={options.template}
                onValueChange={(value: "executive" | "technical" | "comprehensive") =>
                  setOptions((prev) => ({ ...prev, template: value }))
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="executive">Executive Summary</SelectItem>
                  <SelectItem value="technical">Technical Details</SelectItem>
                  <SelectItem value="comprehensive">Comprehensive Report</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}

          {/* Include Options */}
          <div className="space-y-3">
            <Label>Include in Report</Label>
            <Card>
              <CardContent className="p-4 space-y-3">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="includeIssues"
                    checked={options.includeIssues}
                    onCheckedChange={(checked) => setOptions((prev) => ({ ...prev, includeIssues: !!checked }))}
                  />
                  <Label htmlFor="includeIssues" className="text-sm">
                    SEO Issues & Recommendations
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="includeInsights"
                    checked={options.includeInsights}
                    onCheckedChange={(checked) => setOptions((prev) => ({ ...prev, includeInsights: !!checked }))}
                  />
                  <Label htmlFor="includeInsights" className="text-sm">
                    AI-Powered Insights
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="includeScreenshot"
                    checked={options.includeScreenshot}
                    onCheckedChange={(checked) => setOptions((prev) => ({ ...prev, includeScreenshot: !!checked }))}
                  />
                  <Label htmlFor="includeScreenshot" className="text-sm">
                    Website Screenshot
                  </Label>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Export Button */}
          <Button onClick={handleExport} disabled={isGenerating} className="w-full">
            {isGenerating ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Generating Report...
              </>
            ) : (
              <>
                <Download className="w-4 h-4 mr-2" />
                Export {options.format.toUpperCase()} Report
              </>
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
