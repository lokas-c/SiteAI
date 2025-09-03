import { NextResponse } from "next/server"

export const runtime = "edge"

export async function GET() {
  const status = {
    service: "SEO Audit API",
    status: "healthy",
    timestamp: new Date().toISOString(),
    version: "1.0.0",
    endpoints: {
      audit: "/api/audit",
      status: "/api/audit/status",
    },
    requirements: {
      cloudflare_account_id: !!process.env.CLOUDFLARE_ACCOUNT_ID,
      cloudflare_api_token: !!process.env.CLOUDFLARE_API_TOKEN,
      google_api_key: !!process.env.GOOGLE_API_KEY, // Added Google API key check
    },
  }

  return NextResponse.json(status)
}
