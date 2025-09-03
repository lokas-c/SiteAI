import { generateText } from "ai"
import { google } from "@ai-sdk/google"
import type { SEOAuditResult } from "./types"

export class AIInsightsEngine {
  private model: ReturnType<typeof google>

  constructor() {
    const apiKey = process.env.GOOGLE_API_KEY
    if (!apiKey) {
      throw new Error("GOOGLE_API_KEY environment variable is required")
    }

    this.model = google("gemini-1.5-pro", {
      apiKey,
    })
  }

  async generateInsights(auditData: Omit<SEOAuditResult, "insights">): Promise<string[]> {
    try {
      const prompt = this.buildAnalysisPrompt(auditData)

      const { text } = await generateText({
        model: this.model,
        prompt,
        temperature: 0.7,
        maxTokens: 2000,
      })

      return this.parseInsights(text)
    } catch (error) {
      console.error("AI insights generation failed:", error)
      return this.getFallbackInsights(auditData)
    }
  }

  private buildAnalysisPrompt(auditData: Omit<SEOAuditResult, "insights">): string {
    const { url, score, issues, metadata, performance } = auditData

    const criticalIssues = issues.filter((issue) => issue.severity === "critical")
    const warningIssues = issues.filter((issue) => issue.severity === "warning")

    return `
You are an expert SEO consultant analyzing a website audit. Provide actionable, specific insights based on the data below.

WEBSITE: ${url}
OVERALL SEO SCORE: ${score.overall}/100

SCORES BY CATEGORY:
- Technical SEO: ${score.technical}/100
- On-Page SEO: ${score.onPage}/100
- Content Quality: ${score.content}/100
- Performance: ${score.performance}/100

METADATA:
- Title: ${metadata.title || "Missing"}
- Description: ${metadata.description || "Missing"}
- Open Graph Title: ${metadata.ogTitle || "Missing"}
- Canonical URL: ${metadata.canonical || "Missing"}

CRITICAL ISSUES (${criticalIssues.length}):
${criticalIssues.map((issue) => `- ${issue.title}: ${issue.description}`).join("\n")}

WARNING ISSUES (${warningIssues.length}):
${warningIssues.map((issue) => `- ${issue.title}: ${issue.description}`).join("\n")}

PERFORMANCE METRICS:
- Load Time: ${performance.loadTime}ms
- Page Size: ${Math.round(performance.pageSize / 1024)}KB
- HTTP Requests: ${performance.requests}

Provide 5-8 specific, actionable insights that prioritize:
1. High-impact improvements
2. Quick wins (easy to implement)
3. Technical optimizations
4. Content strategy recommendations
5. Competitive advantages

Format each insight as a complete sentence. Focus on WHY each recommendation matters and HOW it will improve SEO performance.
    `.trim()
  }

  private parseInsights(text: string): string[] {
    // Split by common delimiters and clean up
    const insights = text
      .split(/\n+/)
      .map((line) => line.trim())
      .filter((line) => line.length > 20) // Filter out short lines
      .map((line) => line.replace(/^[-•*]\s*/, "")) // Remove bullet points
      .map((line) => line.replace(/^\d+\.\s*/, "")) // Remove numbers
      .filter((line) => !line.toLowerCase().includes("insight") && !line.toLowerCase().includes("recommendation")) // Remove headers
      .slice(0, 8) // Limit to 8 insights

    return insights.length > 0 ? insights : this.getDefaultInsights()
  }

  private getFallbackInsights(auditData: Omit<SEOAuditResult, "insights">): string[] {
    const insights: string[] = []
    const { score, issues, metadata, performance } = auditData

    // Score-based insights
    if (score.overall < 70) {
      insights.push(
        "Your website has significant SEO opportunities that could dramatically improve search rankings with focused optimization efforts.",
      )
    }

    if (score.technical < 80) {
      insights.push(
        "Technical SEO improvements should be your top priority, as they provide the foundation for all other optimization efforts.",
      )
    }

    // Issue-based insights
    const criticalIssues = issues.filter((issue) => issue.severity === "critical")
    if (criticalIssues.length > 0) {
      insights.push(
        `Address the ${criticalIssues.length} critical SEO issues immediately, as they are likely preventing search engines from properly indexing your content.`,
      )
    }

    // Metadata insights
    if (!metadata.title) {
      insights.push(
        "Adding a compelling title tag is the single most important on-page SEO improvement you can make right now.",
      )
    }

    if (!metadata.description) {
      insights.push(
        "A well-crafted meta description can significantly improve your click-through rates from search results, acting as your website's elevator pitch.",
      )
    }

    // Performance insights
    if (performance.loadTime > 3000) {
      insights.push(
        "Page speed optimization should be prioritized, as faster loading times directly correlate with better search rankings and user experience.",
      )
    }

    return insights.slice(0, 6)
  }

  private getDefaultInsights(): string[] {
    return [
      "Focus on creating high-quality, original content that provides genuine value to your target audience.",
      "Optimize your website's loading speed by compressing images and minimizing HTTP requests.",
      "Ensure your website is mobile-friendly, as mobile-first indexing is now the standard for search engines.",
      "Build high-quality backlinks from reputable websites in your industry to improve domain authority.",
      "Regularly update your content to keep it fresh and relevant to current search trends.",
    ]
  }
}

export async function generateSEOInsights(auditData: Omit<SEOAuditResult, "insights">): Promise<string[]> {
  try {
    const engine = new AIInsightsEngine()
    return await engine.generateInsights(auditData)
  } catch (error) {
    console.error("Failed to generate AI insights:", error)
    // Return fallback insights if AI fails
    return [
      "Prioritize fixing critical SEO issues to improve your website's search engine visibility.",
      "Focus on creating high-quality, keyword-optimized content that serves user intent.",
      "Improve your website's technical performance to enhance both user experience and search rankings.",
      "Ensure your website follows SEO best practices for meta tags, headings, and internal linking.",
      "Monitor your SEO progress regularly and adjust your strategy based on performance data.",
    ]
  }
}
