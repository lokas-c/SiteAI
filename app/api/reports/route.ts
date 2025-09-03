import { type NextRequest, NextResponse } from "next/server"
import { ReportGenerator, type ReportOptions } from "@/lib/report-generator"
import type { SEOAuditResult } from "@/lib/types"

export const runtime = "edge"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { auditResult, options }: { auditResult: SEOAuditResult; options: ReportOptions } = body

    if (!auditResult || !options) {
      return NextResponse.json({ error: "Missing auditResult or options" }, { status: 400 })
    }

    const reportBlob = await ReportGenerator.generateReport(auditResult, options)
    const buffer = await reportBlob.arrayBuffer()

    const contentType =
      options.format === "pdf" ? "application/pdf" : options.format === "json" ? "application/json" : "text/csv"

    return new NextResponse(buffer, {
      headers: {
        "Content-Type": contentType,
        "Content-Disposition": `attachment; filename="seo-audit-report.${options.format}"`,
      },
    })
  } catch (error) {
    console.error("Report generation error:", error)
    return NextResponse.json(
      { error: "Failed to generate report", details: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 },
    )
  }
}

export async function GET() {
  return NextResponse.json({
    message: "Report generation API",
    supportedFormats: ["pdf", "json", "csv"],
    templates: ["executive", "technical", "comprehensive"],
  })
}
