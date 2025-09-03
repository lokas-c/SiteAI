export interface SEOAuditRequest {
  readonly url: string
  readonly options?: Readonly<{
    includeScreenshot?: boolean
    includeContent?: boolean
    includeLinks?: boolean
    includeMarkdown?: boolean
    timeout?: number
    userAgent?: string
  }>
}

export interface CloudflareResponse {
  readonly success: boolean
  readonly result?: Readonly<{
    content?: string
    screenshot?: string
    markdown?: string
    links?: readonly LinkData[]
    meta?: MetaData
    performance?: PerformanceMetrics
  }>
  readonly errors?: readonly string[]
  readonly messages?: readonly string[]
}

export interface LinkData {
  readonly url: string
  readonly text: string
  readonly type: "internal" | "external"
  readonly rel?: string
  readonly anchor?: string
  readonly nofollow?: boolean
}

export interface MetaData {
  readonly title?: string
  readonly description?: string
  readonly keywords?: string
  readonly ogTitle?: string
  readonly ogDescription?: string
  readonly ogImage?: string
  readonly ogType?: string
  readonly ogUrl?: string
  readonly twitterCard?: string
  readonly twitterSite?: string
  readonly twitterCreator?: string
  readonly canonical?: string
  readonly robots?: string
  readonly viewport?: string
  readonly charset?: string
  readonly language?: string
  readonly author?: string
  readonly generator?: string
}

export interface SEOScore {
  readonly overall: number
  readonly technical: number
  readonly onPage: number
  readonly content: number
  readonly performance: number
  readonly accessibility: number
  readonly security: number
}

export interface SEOIssue {
  readonly id: string
  readonly category: "technical" | "on-page" | "content" | "performance" | "accessibility" | "security"
  readonly severity: "critical" | "warning" | "info"
  readonly title: string
  readonly description: string
  readonly recommendation: string
  readonly impact: "high" | "medium" | "low"
  readonly difficulty: "easy" | "medium" | "hard"
  readonly priority?: number
  readonly resources?: readonly string[]
}

export interface PerformanceMetrics {
  readonly loadTime: number
  readonly pageSize: number
  readonly requests: number
  readonly firstContentfulPaint?: number
  readonly largestContentfulPaint?: number
  readonly cumulativeLayoutShift?: number
  readonly firstInputDelay?: number
  readonly timeToInteractive?: number
}

export interface AccessibilityMetrics {
  readonly score: number
  readonly issues: readonly AccessibilityIssue[]
  readonly wcagLevel: "A" | "AA" | "AAA"
}

export interface AccessibilityIssue {
  readonly type: string
  readonly severity: "critical" | "serious" | "moderate" | "minor"
  readonly description: string
  readonly element?: string
  readonly recommendation: string
}

export interface SecurityMetrics {
  readonly score: number
  readonly https: boolean
  readonly hsts?: boolean
  readonly csp?: boolean
  readonly xssProtection?: boolean
  readonly frameOptions?: boolean
  readonly contentTypeOptions?: boolean
  readonly vulnerabilities: readonly SecurityVulnerability[]
}

export interface SecurityVulnerability {
  readonly type: string
  readonly severity: "critical" | "high" | "medium" | "low"
  readonly description: string
  readonly recommendation: string
}

export interface SEOAuditResult {
  readonly url: string
  readonly timestamp: string
  readonly score: SEOScore
  readonly issues: readonly SEOIssue[]
  readonly insights: readonly string[]
  readonly screenshot?: string
  readonly metadata: MetaData
  readonly performance: PerformanceMetrics
  readonly accessibility?: AccessibilityMetrics
  readonly security?: SecurityMetrics
  readonly technicalDetails: TechnicalDetails
}

export interface TechnicalDetails {
  readonly doctype?: string
  readonly htmlLang?: string
  readonly headings: readonly HeadingStructure[]
  readonly images: readonly ImageAnalysis[]
  readonly links: readonly LinkAnalysis[]
  readonly scripts: readonly ScriptAnalysis[]
  readonly stylesheets: readonly StylesheetAnalysis[]
  readonly structuredData: readonly StructuredDataItem[]
}

export interface HeadingStructure {
  readonly level: 1 | 2 | 3 | 4 | 5 | 6
  readonly text: string
  readonly isEmpty: boolean
}

export interface ImageAnalysis {
  readonly src: string
  readonly alt?: string
  readonly title?: string
  readonly width?: number
  readonly height?: number
  readonly loading?: "lazy" | "eager"
  readonly hasAlt: boolean
  readonly isDecorative: boolean
}

export interface LinkAnalysis {
  readonly href: string
  readonly text: string
  readonly type: "internal" | "external" | "anchor"
  readonly rel?: string
  readonly target?: string
  readonly isNofollow: boolean
}

export interface ScriptAnalysis {
  readonly src?: string
  readonly type?: string
  readonly async: boolean
  readonly defer: boolean
  readonly inline: boolean
  readonly size?: number
}

export interface StylesheetAnalysis {
  readonly href?: string
  readonly media?: string
  readonly inline: boolean
  readonly size?: number
}

export interface StructuredDataItem {
  readonly type: string
  readonly valid: boolean
  readonly errors?: readonly string[]
  readonly warnings?: readonly string[]
}

export interface AIInsightRequest {
  readonly auditData: Omit<SEOAuditResult, "insights">
  readonly options?: Readonly<{
    maxInsights?: number
    focusAreas?: readonly ("technical" | "content" | "performance" | "on-page" | "accessibility" | "security")[]
    tone?: "professional" | "friendly" | "technical"
    includeQuickWins?: boolean
    prioritizeByImpact?: boolean
  }>
}

export interface AIInsightResponse {
  readonly insights: readonly string[]
  readonly quickWins?: readonly string[]
  readonly longTermGoals?: readonly string[]
  readonly confidence: number
  readonly processingTime: number
  readonly focusAreas: readonly string[]
}

export interface AuditStatus {
  readonly id: string
  readonly status: "pending" | "processing" | "completed" | "failed"
  readonly progress: number
  readonly currentStep?: string
  readonly startTime: string
  readonly endTime?: string
  readonly error?: string
}

export interface AuditCache {
  readonly url: string
  readonly result: SEOAuditResult
  readonly cachedAt: string
  readonly expiresAt: string
}
