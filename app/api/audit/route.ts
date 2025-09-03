import { type NextRequest, NextResponse } from "next/server"
import { createCloudflareClient } from "@/lib/cloudflare"
import { SEOAnalyzer } from "@/lib/seo-analyzer"
import { generateSEOInsights } from "@/lib/ai-insights"
import type { SEOAuditRequest, SEOAuditResult } from "@/lib/types"

export const runtime = "edge"

export async function POST(request: NextRequest) {
  try {
    const body: SEOAuditRequest = await request.json()
    const { url, options = {} } = body

    // Validate URL
    if (!url || !isValidUrl(url)) {
      return NextResponse.json({ error: "Invalid URL provided" }, { status: 400 })
    }

    // Initialize Cloudflare client
    const cloudflare = createCloudflareClient()

    // Fetch website data in parallel
    const [content, screenshot, links] = await Promise.allSettled([
      cloudflare.getContent(url),
      options.includeScreenshot ? cloudflare.getScreenshot(url) : Promise.resolve(null),
      options.includeLinks ? cloudflare.getLinks(url) : Promise.resolve([]),
    ])

    // Handle content fetch failure
    if (content.status === "rejected") {
      return NextResponse.json(
        { error: "Failed to fetch website content", details: content.reason?.message },
        { status: 500 },
      )
    }

    // Analyze SEO
    const analyzer = new SEOAnalyzer(content.value, url)
    const analysis = await analyzer.analyze()

    const insights = await generateSEOInsights(analysis)

    // Prepare result
    const result: SEOAuditResult = {
      ...analysis,
      screenshot:
        screenshot.status === "fulfilled" && screenshot.value
          ? `data:image/png;base64,${screenshot.value.toString("base64")}`
          : undefined,
      insights, // Now populated with AI-generated insights
    }

    return NextResponse.json(result)
  } catch (error) {
    console.error("SEO audit error:", error)
    return NextResponse.json(
      { error: "Internal server error", details: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 },
    )
  }
}

function isValidUrl(string: string): boolean {
  try {
    const url = new URL(string)
    return url.protocol === "http:" || url.protocol === "https:"
  } catch {
    return false
  }
}

export async function GET() {
  return NextResponse.json({ message: "SEO Audit API is running" })
}
