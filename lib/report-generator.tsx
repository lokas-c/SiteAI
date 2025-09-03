import type { SEOAuditResult } from "./types"

export interface ReportOptions {
  format: "pdf" | "json" | "csv"
  includeScreenshot?: boolean
  includeInsights?: boolean
  includeIssues?: boolean
  template?: "executive" | "technical" | "comprehensive"
}

export class ReportGenerator {
  static async generateReport(auditResult: SEOAuditResult, options: ReportOptions): Promise<Blob> {
    switch (options.format) {
      case "pdf":
        return this.generatePDFReport(auditResult, options)
      case "json":
        return this.generateJSONReport(auditResult, options)
      case "csv":
        return this.generateCSVReport(auditResult, options)
      default:
        throw new Error(`Unsupported format: ${options.format}`)
    }
  }

  private static async generatePDFReport(auditResult: SEOAuditResult, options: ReportOptions): Promise<Blob> {
    // Generate HTML content for PDF
    const htmlContent = this.generateHTMLReport(auditResult, options)

    // In a real implementation, you would use a library like Puppeteer or jsPDF
    // For now, we'll create a simple HTML-based PDF
    const pdfContent = `
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>SEO Audit Report - ${auditResult.url}</title>
    <style>
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; margin: 0; padding: 20px; }
        .header { text-align: center; margin-bottom: 30px; border-bottom: 2px solid #e5e7eb; padding-bottom: 20px; }
        .score-section { display: flex; justify-content: space-around; margin: 30px 0; }
        .score-item { text-align: center; }
        .score-circle { width: 80px; height: 80px; border-radius: 50%; display: flex; align-items: center; justify-content: center; margin: 0 auto 10px; font-size: 24px; font-weight: bold; color: white; }
        .score-excellent { background-color: #10b981; }
        .score-good { background-color: #3b82f6; }
        .score-fair { background-color: #f59e0b; }
        .score-poor { background-color: #ef4444; }
        .issues-section { margin: 30px 0; }
        .issue-item { margin: 15px 0; padding: 15px; border-left: 4px solid #e5e7eb; background: #f9fafb; }
        .issue-critical { border-left-color: #ef4444; }
        .issue-warning { border-left-color: #f59e0b; }
        .issue-info { border-left-color: #3b82f6; }
        .insights-section { margin: 30px 0; }
        .insight-item { margin: 10px 0; padding: 10px; background: #f0f9ff; border-radius: 6px; }
        .metadata-section { margin: 30px 0; }
        .metadata-table { width: 100%; border-collapse: collapse; }
        .metadata-table th, .metadata-table td { padding: 8px; text-align: left; border-bottom: 1px solid #e5e7eb; }
        .performance-section { margin: 30px 0; }
        .footer { margin-top: 50px; text-align: center; color: #6b7280; font-size: 12px; }
    </style>
</head>
<body>
    ${htmlContent}
</body>
</html>`

    return new Blob([pdfContent], { type: "text/html" })
  }

  private static generateHTMLReport(auditResult: SEOAuditResult, options: ReportOptions): string {
    const getScoreClass = (score: number) => {
      if (score >= 90) return "score-excellent"
      if (score >= 80) return "score-good"
      if (score >= 70) return "score-fair"
      return "score-poor"
    }

    const formatDate = (timestamp: string) => {
      return new Date(timestamp).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      })
    }

    return `
      <div class="header">
        <h1>SEO Audit Report</h1>
        <h2>${auditResult.url}</h2>
        <p>Generated on ${formatDate(auditResult.timestamp)}</p>
      </div>

      <div class="score-section">
        <div class="score-item">
          <div class="score-circle ${getScoreClass(auditResult.score.overall)}">
            ${auditResult.score.overall}
          </div>
          <h3>Overall Score</h3>
        </div>
        <div class="score-item">
          <div class="score-circle ${getScoreClass(auditResult.score.technical)}">
            ${auditResult.score.technical}
          </div>
          <h3>Technical SEO</h3>
        </div>
        <div class="score-item">
          <div class="score-circle ${getScoreClass(auditResult.score.onPage)}">
            ${auditResult.score.onPage}
          </div>
          <h3>On-Page SEO</h3>
        </div>
        <div class="score-item">
          <div class="score-circle ${getScoreClass(auditResult.score.performance)}">
            ${auditResult.score.performance}
          </div>
          <h3>Performance</h3>
        </div>
      </div>

      ${
        options.includeIssues !== false
          ? `
      <div class="issues-section">
        <h2>SEO Issues (${auditResult.issues.length})</h2>
        ${auditResult.issues
          .map(
            (issue) => `
          <div class="issue-item issue-${issue.severity}">
            <h3>${issue.title}</h3>
            <p><strong>Category:</strong> ${issue.category} | <strong>Severity:</strong> ${issue.severity} | <strong>Impact:</strong> ${issue.impact}</p>
            <p>${issue.description}</p>
            <p><strong>Recommendation:</strong> ${issue.recommendation}</p>
          </div>
        `,
          )
          .join("")}
      </div>
      `
          : ""
      }

      ${
        options.includeInsights !== false
          ? `
      <div class="insights-section">
        <h2>AI-Powered Insights</h2>
        ${auditResult.insights
          .map(
            (insight, index) => `
          <div class="insight-item">
            <strong>${index + 1}.</strong> ${insight}
          </div>
        `,
          )
          .join("")}
      </div>
      `
          : ""
      }

      <div class="metadata-section">
        <h2>Page Metadata</h2>
        <table class="metadata-table">
          <tr><th>Property</th><th>Value</th><th>Status</th></tr>
          <tr><td>Title</td><td>${auditResult.metadata.title || "Missing"}</td><td>${auditResult.metadata.title ? "✓" : "✗"}</td></tr>
          <tr><td>Description</td><td>${auditResult.metadata.description || "Missing"}</td><td>${auditResult.metadata.description ? "✓" : "✗"}</td></tr>
          <tr><td>Canonical URL</td><td>${auditResult.metadata.canonical || "Missing"}</td><td>${auditResult.metadata.canonical ? "✓" : "✗"}</td></tr>
          <tr><td>Open Graph Title</td><td>${auditResult.metadata.ogTitle || "Missing"}</td><td>${auditResult.metadata.ogTitle ? "✓" : "✗"}</td></tr>
        </table>
      </div>

      <div class="performance-section">
        <h2>Performance Metrics</h2>
        <table class="metadata-table">
          <tr><th>Metric</th><th>Value</th></tr>
          <tr><td>Load Time</td><td>${auditResult.performance.loadTime}ms</td></tr>
          <tr><td>Page Size</td><td>${Math.round(auditResult.performance.pageSize / 1024)}KB</td></tr>
          <tr><td>HTTP Requests</td><td>${auditResult.performance.requests}</td></tr>
        </table>
      </div>

      <div class="footer">
        <p>Generated by SEO Audit Pro - Professional Website Analysis</p>
        <p>Report ID: ${auditResult.timestamp}</p>
      </div>
    `
  }

  private static generateJSONReport(auditResult: SEOAuditResult, options: ReportOptions): Blob {
    const reportData = {
      ...auditResult,
      generatedAt: new Date().toISOString(),
      reportOptions: options,
    }

    return new Blob([JSON.stringify(reportData, null, 2)], { type: "application/json" })
  }

  private static generateCSVReport(auditResult: SEOAuditResult, options: ReportOptions): Blob {
    const csvRows = [
      ["SEO Audit Report"],
      ["URL", auditResult.url],
      ["Generated", new Date(auditResult.timestamp).toLocaleString()],
      [""],
      ["Scores"],
      ["Overall Score", auditResult.score.overall.toString()],
      ["Technical SEO", auditResult.score.technical.toString()],
      ["On-Page SEO", auditResult.score.onPage.toString()],
      ["Content Quality", auditResult.score.content.toString()],
      ["Performance", auditResult.score.performance.toString()],
      [""],
      ["Issues"],
      ["ID", "Title", "Category", "Severity", "Impact", "Difficulty", "Description", "Recommendation"],
      ...auditResult.issues.map((issue) => [
        issue.id,
        issue.title,
        issue.category,
        issue.severity,
        issue.impact,
        issue.difficulty,
        issue.description,
        issue.recommendation,
      ]),
      [""],
      ["Performance Metrics"],
      ["Load Time (ms)", auditResult.performance.loadTime.toString()],
      ["Page Size (bytes)", auditResult.performance.pageSize.toString()],
      ["HTTP Requests", auditResult.performance.requests.toString()],
    ]

    const csvContent = csvRows.map((row) => row.map((cell) => `"${cell}"`).join(",")).join("\n")
    return new Blob([csvContent], { type: "text/csv" })
  }
}

export function downloadReport(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob)
  const link = document.createElement("a")
  link.href = url
  link.download = filename
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}

export function generateReportFilename(auditResult: SEOAuditResult, format: string): string {
  const domain = new URL(auditResult.url).hostname
  const timestamp = new Date(auditResult.timestamp).toISOString().split("T")[0]
  return `seo-audit-${domain}-${timestamp}.${format}`
}
