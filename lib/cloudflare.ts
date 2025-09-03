interface CloudflareConfig {
  accountId: string
  apiToken: string
}

interface CloudflareRequestOptions {
  url?: string
  html?: string
  viewport?: {
    width: number
    height: number
  }
  gotoOptions?: {
    waitUntil?: "load" | "domcontentloaded" | "networkidle0" | "networkidle2"
    timeout?: number
  }
  screenshotOptions?: {
    fullPage?: boolean
    omitBackground?: boolean
    type?: "png" | "jpeg"
    quality?: number
  }
  rejectResourceTypes?: string[]
  visibleLinksOnly?: boolean
}

export class CloudflareClient {
  private config: CloudflareConfig

  constructor(config: CloudflareConfig) {
    this.config = config
  }

  private async makeRequest(endpoint: string, options: CloudflareRequestOptions) {
    const response = await fetch(
      `https://api.cloudflare.com/client/v4/accounts/${this.config.accountId}/browser-rendering/${endpoint}`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${this.config.apiToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(options),
      },
    )

    if (!response.ok) {
      throw new Error(`Cloudflare API error: ${response.status} ${response.statusText}`)
    }

    return response
  }

  async getScreenshot(url: string, options?: Partial<CloudflareRequestOptions>): Promise<Buffer> {
    const response = await this.makeRequest("screenshot", {
      url,
      viewport: { width: 1920, height: 1080 },
      gotoOptions: { waitUntil: "networkidle0", timeout: 30000 },
      screenshotOptions: { fullPage: true, type: "png" },
      ...options,
    })

    return Buffer.from(await response.arrayBuffer())
  }

  async getContent(url: string, options?: Partial<CloudflareRequestOptions>): Promise<string> {
    const response = await this.makeRequest("content", {
      url,
      gotoOptions: { waitUntil: "networkidle0", timeout: 30000 },
      ...options,
    })

    const data = await response.json()
    return data.result || ""
  }

  async getMarkdown(url: string, options?: Partial<CloudflareRequestOptions>): Promise<string> {
    const response = await this.makeRequest("markdown", {
      url,
      gotoOptions: { waitUntil: "networkidle0", timeout: 30000 },
      ...options,
    })

    const data = await response.json()
    return data.result || ""
  }

  async getLinks(url: string, options?: Partial<CloudflareRequestOptions>): Promise<string[]> {
    const response = await this.makeRequest("links", {
      url,
      visibleLinksOnly: true,
      gotoOptions: { waitUntil: "networkidle0", timeout: 30000 },
      ...options,
    })

    const data = await response.json()
    return data.result || []
  }
}

export function createCloudflareClient(): CloudflareClient {
  const accountId = process.env.CLOUDFLARE_ACCOUNT_ID
  const apiToken = process.env.CLOUDFLARE_API_TOKEN

  if (!accountId || !apiToken) {
    throw new Error("Missing Cloudflare credentials: CLOUDFLARE_ACCOUNT_ID and CLOUDFLARE_API_TOKEN required")
  }

  return new CloudflareClient({ accountId, apiToken })
}
