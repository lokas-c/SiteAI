"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ScoreDisplay } from "@/components/seo/score-display"
import { IssueCard } from "@/components/seo/issue-card"
import { InsightsDisplay } from "@/components/seo/insights-display"
import { PerformanceMetrics } from "@/components/seo/performance-metrics"
import { AuditProgress } from "@/components/seo/audit-progress"
import { MetadataPreview } from "@/components/seo/metadata-preview"
import { ExportDialog } from "@/components/seo/export-dialog"
import { ShareDialog } from "@/components/seo/share-dialog"
import type { SEOAuditResult } from "@/lib/types"
import { Globe, Search, ArrowLeft } from "lucide-react"
import Link from "next/link"

type AuditState = "idle" | "running" | "completed" | "error"

export default function AuditPage() {
  const [url, setUrl] = useState("")
  const [auditState, setAuditState] = useState<AuditState>("idle")
  const [auditResult, setAuditResult] = useState<SEOAuditResult | null>(null)
  const [error, setError] = useState<string | null>(null)

  const auditSteps = [
    {
      id: "fetch",
      label: "Fetching Website Content",
      status: "pending" as const,
      description: "Loading HTML and resources",
    },
    {
      id: "analyze",
      label: "Analyzing SEO Elements",
      status: "pending" as const,
      description: "Checking meta tags, headers, and structure",
    },
    {
      id: "performance",
      label: "Performance Analysis",
      status: "pending" as const,
      description: "Measuring load times and optimization",
    },
    {
      id: "ai",
      label: "Generating AI Insights",
      status: "pending" as const,
      description: "Creating personalized recommendations",
    },
    {
      id: "complete",
      label: "Finalizing Report",
      status: "pending" as const,
      description: "Compiling comprehensive results",
    },
  ]

  const [currentSteps, setCurrentSteps] = useState(auditSteps)

  const startAudit = async () => {
    if (!url.trim()) return

    setAuditState("running")
    setError(null)
    setAuditResult(null)

    // Reset steps
    const resetSteps = auditSteps.map((step) => ({ ...step, status: "pending" as const }))
    setCurrentSteps(resetSteps)

    try {
      // Simulate step progression
      for (let i = 0; i < auditSteps.length; i++) {
        const updatedSteps = [...resetSteps]

        // Mark current step as running
        updatedSteps[i] = { ...updatedSteps[i], status: "running" }
        setCurrentSteps(updatedSteps)

        // Simulate processing time
        await new Promise((resolve) => setTimeout(resolve, 1000 + Math.random() * 1500))

        // Mark current step as completed
        updatedSteps[i] = { ...updatedSteps[i], status: "completed" }

        // Mark previous steps as completed
        for (let j = 0; j < i; j++) {
          updatedSteps[j] = { ...updatedSteps[j], status: "completed" }
        }

        setCurrentSteps(updatedSteps)
      }

      // Make actual API call
      const response = await fetch("/api/audit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          url,
          options: {
            includeScreenshot: true,
            includeLinks: true,
          },
        }),
      })

      if (!response.ok) {
        throw new Error(`Audit failed: ${response.statusText}`)
      }

      const result: SEOAuditResult = await response.json()
      setAuditResult(result)
      setAuditState("completed")
    } catch (err) {
      console.error("Audit error:", err)
      setError(err instanceof Error ? err.message : "An unexpected error occurred")
      setAuditState("error")

      // Mark current step as error
      const errorSteps = [...currentSteps]
      const runningStepIndex = errorSteps.findIndex((step) => step.status === "running")
      if (runningStepIndex !== -1) {
        errorSteps[runningStepIndex] = { ...errorSteps[runningStepIndex], status: "error" }
        setCurrentSteps(errorSteps)
      }
    }
  }

  const resetAudit = () => {
    setAuditState("idle")
    setAuditResult(null)
    setError(null)
    setUrl("")
    setCurrentSteps(auditSteps)
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 sm:gap-4">
              <Link
                href="/"
                className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                <span className="hidden sm:inline">Back</span>
              </Link>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                  <Search className="w-5 h-5 text-primary-foreground" />
                </div>
                <h1 className="text-lg sm:text-xl font-bold text-foreground font-serif">SEO Audit Dashboard</h1>
              </div>
            </div>
            {auditResult && (
              <div className="flex items-center gap-1 sm:gap-2">
                <ExportDialog auditResult={auditResult} />
                <ShareDialog auditResult={auditResult} />
              </div>
            )}
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-6 sm:py-8 max-w-7xl">
        {/* URL Input Section */}
        {auditState === "idle" && (
          <div className="max-w-2xl mx-auto text-center space-y-6 sm:space-y-8">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-foreground mb-4 font-serif">
                Analyze Your Website's SEO Performance
              </h1>
              <p className="text-muted-foreground leading-relaxed">
                Get comprehensive insights and actionable recommendations to improve your search rankings
              </p>
            </div>

            <Card>
              <CardContent className="p-4 sm:p-6">
                <div className="flex flex-col sm:flex-row gap-3">
                  <div className="relative flex-1">
                    <Globe className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                    <Input
                      placeholder="https://example.com"
                      value={url}
                      onChange={(e) => setUrl(e.target.value)}
                      className="pl-10 h-12 text-base"
                      onKeyDown={(e) => e.key === "Enter" && startAudit()}
                    />
                  </div>
                  <Button size="lg" onClick={startAudit} disabled={!url.trim()} className="h-12 px-6 w-full sm:w-auto">
                    <Search className="w-4 h-4 mr-2" />
                    Start Audit
                  </Button>
                </div>
                <p className="text-sm text-muted-foreground mt-3 text-center">
                  Free comprehensive analysis • Results in 30-60 seconds
                </p>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Running State */}
        {auditState === "running" && (
          <div className="max-w-2xl mx-auto space-y-6">
            <div className="text-center">
              <h2 className="text-xl sm:text-2xl font-bold text-foreground mb-2">Analyzing {url}</h2>
              <p className="text-muted-foreground">Please wait while we analyze your website...</p>
            </div>

            <AuditProgress
              steps={currentSteps}
              currentStep={currentSteps.find((step) => step.status === "running")?.id}
            />

            <div className="text-center">
              <Button variant="outline" onClick={resetAudit}>
                Cancel Audit
              </Button>
            </div>
          </div>
        )}

        {/* Error State */}
        {auditState === "error" && (
          <div className="max-w-2xl mx-auto text-center space-y-6">
            <Card className="border-destructive">
              <CardHeader>
                <CardTitle className="text-destructive">Audit Failed</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">{error}</p>
                <div className="flex flex-col sm:flex-row gap-2 justify-center">
                  <Button onClick={startAudit} className="w-full sm:w-auto">
                    Try Again
                  </Button>
                  <Button variant="outline" onClick={resetAudit} className="w-full sm:w-auto bg-transparent">
                    Start Over
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Results State */}
        {auditState === "completed" && auditResult && (
          <div className="space-y-6 sm:space-y-8">
            {/* Results Header */}
            <div className="text-center space-y-4">
              <div>
                <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-2 font-serif">Audit Complete</h2>
                <p className="text-muted-foreground break-all">Analysis for {auditResult.url}</p>
                <Badge variant="outline" className="mt-2">
                  Completed {new Date(auditResult.timestamp).toLocaleString()}
                </Badge>
              </div>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-2 flex-wrap">
                <Button variant="outline" onClick={resetAudit} className="w-full sm:w-auto bg-transparent">
                  Analyze Another Website
                </Button>
                <ExportDialog auditResult={auditResult}>
                  <Button variant="outline" className="w-full sm:w-auto bg-transparent">
                    Export Report
                  </Button>
                </ExportDialog>
                <ShareDialog auditResult={auditResult}>
                  <Button variant="outline" className="w-full sm:w-auto bg-transparent">
                    Share Results
                  </Button>
                </ShareDialog>
              </div>
            </div>

            {/* Main Results Grid */}
            <div className="grid gap-6 sm:gap-8 lg:grid-cols-3">
              {/* Left Column - Score & Performance */}
              <div className="space-y-6 lg:col-span-1">
                <ScoreDisplay score={auditResult.score} />
                <PerformanceMetrics performance={auditResult.performance} />
              </div>

              {/* Middle Column - Issues */}
              <div className="space-y-6 lg:col-span-1">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">SEO Issues</CardTitle>
                    <Badge variant="outline">{auditResult.issues.length} issues found</Badge>
                  </CardHeader>
                  <CardContent className="space-y-4 max-h-96 overflow-y-auto">
                    {auditResult.issues.length > 0 ? (
                      auditResult.issues.map((issue) => <IssueCard key={issue.id} issue={issue} />)
                    ) : (
                      <p className="text-muted-foreground text-center py-8">
                        No issues found! Your website is well optimized.
                      </p>
                    )}
                  </CardContent>
                </Card>
              </div>

              {/* Right Column - Insights & Metadata */}
              <div className="space-y-6 lg:col-span-1">
                <InsightsDisplay insights={auditResult.insights} />
                <MetadataPreview metadata={auditResult.metadata} url={auditResult.url} />
              </div>
            </div>

            {/* Screenshot Section */}
            {auditResult.screenshot && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Website Screenshot</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="rounded-lg overflow-hidden border">
                    <img
                      src={auditResult.screenshot || "/placeholder.svg"}
                      alt="Website screenshot"
                      className="w-full h-auto"
                    />
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
