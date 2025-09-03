import { type NextRequest, NextResponse } from "next/server"
import type { SEOAuditResult } from "@/lib/types"

export const runtime = "edge"

// In a real implementation, you would store this in a database
const sharedReports = new Map<string, { auditResult: SEOAuditResult; expiresAt: Date }>()

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { auditResult }: { auditResult: SEOAuditResult } = body

    if (!auditResult) {
      return NextResponse.json({ error: "Missing audit result" }, { status: 400 })
    }

    // Generate a unique share ID
    const shareId = generateShareId()

    // Set expiration to 30 days from now
    const expiresAt = new Date()
    expiresAt.setDate(expiresAt.getDate() + 30)

    // Store the shared report
    sharedReports.set(shareId, { auditResult, expiresAt })

    const shareUrl = `${request.nextUrl.origin}/shared/${shareId}`

    return NextResponse.json({
      shareId,
      shareUrl,
      expiresAt: expiresAt.toISOString(),
    })
  } catch (error) {
    console.error("Share creation error:", error)
    return NextResponse.json(
      { error: "Failed to create share link", details: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 },
    )
  }
}

export async function GET(request: NextRequest) {
  const shareId = request.nextUrl.searchParams.get("id")

  if (!shareId) {
    return NextResponse.json({ error: "Missing share ID" }, { status: 400 })
  }

  const sharedReport = sharedReports.get(shareId)

  if (!sharedReport) {
    return NextResponse.json({ error: "Share not found" }, { status: 404 })
  }

  if (new Date() > sharedReport.expiresAt) {
    sharedReports.delete(shareId)
    return NextResponse.json({ error: "Share has expired" }, { status: 410 })
  }

  return NextResponse.json({
    auditResult: sharedReport.auditResult,
    expiresAt: sharedReport.expiresAt.toISOString(),
  })
}

function generateShareId(): string {
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)
}
