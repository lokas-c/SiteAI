"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ScoreDisplay } from "@/components/seo/score-display"
import { IssueCard } from "@/components/seo/issue-card"
import { InsightsDisplay } from "@/components/seo/insights-display"
import { PerformanceMetrics } from "@/components/seo/performance-metrics"
import { MetadataPreview } from "@/components/seo/metadata-preview"
import type { SEOAuditResult } from "@/lib/types"
import { BarChart3, Download, ExternalLink, AlertCircle } from "lucide-react"
import Link from "next/link"

export default function SharedReportPage() {
  const params = useParams()
  const shareId = params.shareId as string
  const [auditResult, setAuditResult] = useState<SEOAuditResult | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [expiresAt, setExpiresAt] = useState<string | null>(null)

  useEffect(() => {
    const fetchSharedReport = async () => {
      try {
        const response = await fetch(`/api/share?id=${shareId}`)

        if (!response.ok) {
          const errorData = await response.json()
          throw new Error(errorData.error || "Failed to load shared report")
        }

        const data = await response.json()
        setAuditResult(data.auditResult)
        setExpiresAt(data.expiresAt)
      } catch (err) {
        setError(err instanceof Error ? err.message : "An unexpected error occurred")
      } finally {
        setLoading(false)
      }
    }

    if (shareId) {
      fetchSharedReport()
    }
  }, [shareId])

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mb-4"></div>
            <p className="text-muted-foreground">Loading shared report...</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="w-full max-w-md border-destructive">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-destructive">
              <AlertCircle className="w-5 h-5" />
              Report Not Available
            </CardTitle>
          </CardHeader>
          <CardContent className="text-center space-y-4">
            <p className="text-muted-foreground">{error}</p>
            <Link href="/">
              <Button>Create New Audit</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (!auditResult) {
    return null
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link
                href="/"
                className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
              >
                <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                  <BarChart3 className="w-5 h-5 text-primary-foreground" />
                </div>
                <span className="font-bold text-foreground font-serif">SEO Audit Pro</span>
              </Link>
              <Badge variant="outline">Shared Report</Badge>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm">
                <Download className="w-4 h-4 mr-2" />
                Download
              </Button>
              <Link href="/audit">
                <Button size="sm">
                  <ExternalLink className="w-4 h-4 mr-2" />
                  Create Your Own
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Report Header */}
        <div className="text-center space-y-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-foreground mb-2 font-serif">SEO Audit Report</h1>
            <p className="text-muted-foreground">Analysis for {auditResult.url}</p>
            <div className="flex items-center justify-center gap-4 mt-4">
              <Badge variant="outline">Generated {new Date(auditResult.timestamp).toLocaleDateString()}</Badge>
              {expiresAt && <Badge variant="secondary">Expires {new Date(expiresAt).toLocaleDateString()}</Badge>}
            </div>
          </div>
        </div>

        {/* Results Grid */}
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Column - Score & Performance */}
          <div className="space-y-6">
            <ScoreDisplay score={auditResult.score} />
            <PerformanceMetrics performance={auditResult.performance} />
          </div>

          {/* Middle Column - Issues */}
          <div className="space-y-6">
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
                    No issues found! This website is well optimized.
                  </p>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Insights & Metadata */}
          <div className="space-y-6">
            <InsightsDisplay insights={auditResult.insights} />
            <MetadataPreview metadata={auditResult.metadata} url={auditResult.url} />
          </div>
        </div>

        {/* Screenshot Section */}
        {auditResult.screenshot && (
          <Card className="mt-8">
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

        {/* Footer CTA */}
        <div className="text-center mt-12 py-8 border-t border-border">
          <h3 className="text-xl font-bold text-foreground mb-2">Want to audit your own website?</h3>
          <p className="text-muted-foreground mb-4">Get comprehensive SEO analysis with AI-powered insights for free</p>
          <Link href="/audit">
            <Button size="lg">Start Free Audit</Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
