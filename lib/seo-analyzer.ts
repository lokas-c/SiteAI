import { JSDOM } from "jsdom"
import type {
  SEOScore,
  SEOIssue,
  MetaData,
  SEOAuditResult,
  TechnicalDetails,
  HeadingStructure,
  ImageAnalysis,
  LinkAnalysis,
  AccessibilityMetrics,
  SecurityMetrics,
  PerformanceMetrics,
} from "./types"

export class SEOAnalyzer {
  private readonly dom: JSDOM
  private readonly document: Document
  private readonly url: string

  constructor(html: string, url: string) {
    this.dom = new JSDOM(html)
    this.document = this.dom.window.document
    this.url = url
  }

  async analyze(): Promise<Omit<SEOAuditResult, "screenshot" | "insights">> {
    const metadata = this.extractMetadata()
    const technicalDetails = this.analyzeTechnicalDetails()
    const issues = this.findSEOIssues(metadata, technicalDetails)
    const score = this.calculateScore(issues)
    const performance = this.analyzePerformance()
    const accessibility = this.analyzeAccessibility()
    const security = this.analyzeSecurity()

    return {
      url: this.url,
      timestamp: new Date().toISOString(),
      score,
      issues,
      metadata,
      performance,
      accessibility,
      security,
      technicalDetails,
    }
  }

  private extractMetadata(): MetaData {
    const getMetaContent = (name: string): string | undefined => {
      const meta = this.document.querySelector(`meta[name="${name}"], meta[property="${name}"]`)
      return meta?.getAttribute("content") || undefined
    }

    const title = this.document.querySelector("title")?.textContent || undefined
    const canonical = this.document.querySelector('link[rel="canonical"]')?.getAttribute("href") || undefined

    return {
      title,
      description: getMetaContent("description"),
      keywords: getMetaContent("keywords"),
      ogTitle: getMetaContent("og:title"),
      ogDescription: getMetaContent("og:description"),
      ogImage: getMetaContent("og:image"),
      ogType: getMetaContent("og:type"),
      ogUrl: getMetaContent("og:url"),
      twitterCard: getMetaContent("twitter:card"),
      twitterSite: getMetaContent("twitter:site"),
      twitterCreator: getMetaContent("twitter:creator"),
      canonical,
      robots: getMetaContent("robots"),
      viewport: getMetaContent("viewport"),
      charset:
        this.document.querySelector("meta[charset]")?.getAttribute("charset") ||
        this.document
          .querySelector('meta[http-equiv="Content-Type"]')
          ?.getAttribute("content")
          ?.match(/charset=([^;]+)/)?.[1],
      language: this.document.documentElement.getAttribute("lang") || undefined,
      author: getMetaContent("author"),
      generator: getMetaContent("generator"),
    }
  }

  private analyzeTechnicalDetails(): TechnicalDetails {
    const headings = this.analyzeHeadings()
    const images = this.analyzeImages()
    const links = this.analyzeLinks()
    const scripts = this.analyzeScripts()
    const stylesheets = this.analyzeStylesheets()
    const structuredData = this.analyzeStructuredData()

    return {
      doctype: this.document.doctype?.name || undefined,
      htmlLang: this.document.documentElement.getAttribute("lang") || undefined,
      headings,
      images,
      links,
      scripts,
      stylesheets,
      structuredData,
    }
  }

  private analyzeHeadings(): HeadingStructure[] {
    const headings: HeadingStructure[] = []
    for (let level = 1; level <= 6; level++) {
      const elements = this.document.querySelectorAll(`h${level}`)
      elements.forEach((element) => {
        headings.push({
          level: level as 1 | 2 | 3 | 4 | 5 | 6,
          text: element.textContent?.trim() || "",
          isEmpty: !element.textContent?.trim(),
        })
      })
    }
    return headings
  }

  private analyzeImages(): ImageAnalysis[] {
    const images = this.document.querySelectorAll("img")
    return Array.from(images).map((img) => ({
      src: img.getAttribute("src") || "",
      alt: img.getAttribute("alt") || undefined,
      title: img.getAttribute("title") || undefined,
      width: img.getAttribute("width") ? Number.parseInt(img.getAttribute("width")!) : undefined,
      height: img.getAttribute("height") ? Number.parseInt(img.getAttribute("height")!) : undefined,
      loading: img.getAttribute("loading") as "lazy" | "eager" | undefined,
      hasAlt: img.hasAttribute("alt"),
      isDecorative: img.getAttribute("alt") === "" || img.getAttribute("role") === "presentation",
    }))
  }

  private analyzeLinks(): LinkAnalysis[] {
    const links = this.document.querySelectorAll("a[href]")
    return Array.from(links).map((link) => {
      const href = link.getAttribute("href") || ""
      let type: "internal" | "external" | "anchor"

      if (href.startsWith("#")) {
        type = "anchor"
      } else if (href.startsWith("http") && !href.includes(new URL(this.url).hostname)) {
        type = "external"
      } else {
        type = "internal"
      }

      return {
        href,
        text: link.textContent?.trim() || "",
        type,
        rel: link.getAttribute("rel") || undefined,
        target: link.getAttribute("target") || undefined,
        isNofollow: link.getAttribute("rel")?.includes("nofollow") || false,
      }
    })
  }

  private analyzeScripts(): any[] {
    const scripts = this.document.querySelectorAll("script")
    return Array.from(scripts).map((script) => ({
      src: script.getAttribute("src") || undefined,
      type: script.getAttribute("type") || undefined,
      async: script.hasAttribute("async"),
      defer: script.hasAttribute("defer"),
      inline: !script.hasAttribute("src"),
      size: script.textContent?.length || 0,
    }))
  }

  private analyzeStylesheets(): any[] {
    const stylesheets = this.document.querySelectorAll('link[rel="stylesheet"], style')
    return Array.from(stylesheets).map((sheet) => ({
      href: sheet.getAttribute("href") || undefined,
      media: sheet.getAttribute("media") || undefined,
      inline: sheet.tagName.toLowerCase() === "style",
      size: sheet.textContent?.length || 0,
    }))
  }

  private analyzeStructuredData(): any[] {
    const scripts = this.document.querySelectorAll('script[type="application/ld+json"]')
    return Array.from(scripts).map((script) => {
      try {
        const data = JSON.parse(script.textContent || "")
        return {
          type: data["@type"] || "Unknown",
          valid: true,
          errors: [],
          warnings: [],
        }
      } catch (error) {
        return {
          type: "Invalid",
          valid: false,
          errors: ["Invalid JSON-LD syntax"],
          warnings: [],
        }
      }
    })
  }

  private analyzeAccessibility(): AccessibilityMetrics {
    let score = 100
    const issues: any[] = []

    // Check for missing alt text
    const imagesWithoutAlt = this.document.querySelectorAll("img:not([alt])")
    if (imagesWithoutAlt.length > 0) {
      issues.push({
        type: "missing-alt-text",
        severity: "serious" as const,
        description: `${imagesWithoutAlt.length} images missing alt text`,
        recommendation: "Add descriptive alt text to all images",
      })
      score -= 15
    }

    // Check for proper heading hierarchy
    const headings = this.document.querySelectorAll("h1, h2, h3, h4, h5, h6")
    let previousLevel = 0
    Array.from(headings).forEach((heading) => {
      const currentLevel = Number.parseInt(heading.tagName.charAt(1))
      if (currentLevel > previousLevel + 1) {
        issues.push({
          type: "heading-hierarchy",
          severity: "moderate" as const,
          description: "Improper heading hierarchy detected",
          element: heading.tagName,
          recommendation: "Ensure headings follow proper hierarchy (H1 → H2 → H3, etc.)",
        })
        score -= 10
      }
      previousLevel = currentLevel
    })

    // Check for color contrast (basic check)
    const elementsWithColor = this.document.querySelectorAll("[style*='color']")
    if (elementsWithColor.length > 0) {
      issues.push({
        type: "color-contrast",
        severity: "moderate" as const,
        description: "Manual color contrast verification needed",
        recommendation: "Ensure all text meets WCAG AA contrast requirements (4.5:1)",
      })
    }

    return {
      score: Math.max(0, score),
      issues,
      wcagLevel: score >= 90 ? "AAA" : score >= 70 ? "AA" : "A",
    }
  }

  private analyzeSecurity(): SecurityMetrics {
    let score = 100
    const vulnerabilities: any[] = []

    const isHttps = this.url.startsWith("https://")
    if (!isHttps) {
      vulnerabilities.push({
        type: "insecure-protocol",
        severity: "critical" as const,
        description: "Website not using HTTPS",
        recommendation: "Implement SSL/TLS certificate and redirect HTTP to HTTPS",
      })
      score -= 30
    }

    // Check for security headers (simulated - would need actual response headers)
    const hasCSP = this.document.querySelector('meta[http-equiv="Content-Security-Policy"]')
    if (!hasCSP) {
      vulnerabilities.push({
        type: "missing-csp",
        severity: "medium" as const,
        description: "Missing Content Security Policy",
        recommendation: "Implement CSP headers to prevent XSS attacks",
      })
      score -= 15
    }

    return {
      score: Math.max(0, score),
      https: isHttps,
      csp: !!hasCSP,
      vulnerabilities,
    }
  }

  private findSEOIssues(metadata: MetaData, technicalDetails: TechnicalDetails): SEOIssue[] {
    const issues: SEOIssue[] = []

    // Title tag analysis
    if (!metadata.title?.trim()) {
      issues.push({
        id: "missing-title",
        category: "on-page",
        severity: "critical",
        title: "Missing Title Tag",
        description: "The page is missing a title tag, which is crucial for SEO.",
        recommendation: "Add a descriptive title tag between 30-60 characters.",
        impact: "high",
        difficulty: "easy",
        priority: 1,
      })
    } else {
      const titleLength = metadata.title.length
      if (titleLength < 30) {
        issues.push({
          id: "title-too-short",
          category: "on-page",
          severity: "warning",
          title: "Title Tag Too Short",
          description: `Title tag is ${titleLength} characters. Optimal length is 30-60 characters.`,
          recommendation: "Expand the title to include more descriptive keywords.",
          impact: "medium",
          difficulty: "easy",
          priority: 3,
        })
      } else if (titleLength > 60) {
        issues.push({
          id: "title-too-long",
          category: "on-page",
          severity: "warning",
          title: "Title Tag Too Long",
          description: `Title tag is ${titleLength} characters. It may be truncated in search results.`,
          recommendation: "Shorten the title to 30-60 characters while keeping key information.",
          impact: "medium",
          difficulty: "easy",
          priority: 3,
        })
      }
    }

    // Meta description analysis
    if (!metadata.description?.trim()) {
      issues.push({
        id: "missing-meta-description",
        category: "on-page",
        severity: "critical",
        title: "Missing Meta Description",
        description: "The page is missing a meta description tag.",
        recommendation: "Add a compelling meta description between 120-160 characters.",
        impact: "high",
        difficulty: "easy",
        priority: 2,
      })
    } else {
      const descLength = metadata.description.length
      if (descLength < 120) {
        issues.push({
          id: "meta-description-too-short",
          category: "on-page",
          severity: "warning",
          title: "Meta Description Too Short",
          description: `Meta description is ${descLength} characters. Optimal length is 120-160 characters.`,
          recommendation: "Expand the meta description to provide more context.",
          impact: "medium",
          difficulty: "easy",
          priority: 4,
        })
      } else if (descLength > 160) {
        issues.push({
          id: "meta-description-too-long",
          category: "on-page",
          severity: "warning",
          title: "Meta Description Too Long",
          description: `Meta description is ${descLength} characters. It may be truncated in search results.`,
          recommendation: "Shorten the meta description to 120-160 characters.",
          impact: "medium",
          difficulty: "easy",
          priority: 4,
        })
      }
    }

    const h1Headings = technicalDetails.headings.filter((h) => h.level === 1)
    if (h1Headings.length === 0) {
      issues.push({
        id: "missing-h1",
        category: "on-page",
        severity: "critical",
        title: "Missing H1 Tag",
        description: "The page is missing an H1 tag, which is important for content hierarchy.",
        recommendation: "Add a single, descriptive H1 tag that summarizes the page content.",
        impact: "high",
        difficulty: "easy",
        priority: 2,
      })
    } else if (h1Headings.length > 1) {
      issues.push({
        id: "multiple-h1",
        category: "on-page",
        severity: "warning",
        title: "Multiple H1 Tags",
        description: `Found ${h1Headings.length} H1 tags. Best practice is to use only one H1 per page.`,
        recommendation: "Use only one H1 tag and convert others to H2 or lower-level headings.",
        impact: "medium",
        difficulty: "easy",
        priority: 5,
      })
    }

    const imagesWithoutAlt = technicalDetails.images.filter((img) => !img.hasAlt)
    if (imagesWithoutAlt.length > 0) {
      issues.push({
        id: "images-missing-alt",
        category: "accessibility",
        severity: "warning",
        title: "Images Missing Alt Text",
        description: `${imagesWithoutAlt.length} out of ${technicalDetails.images.length} images are missing alt text.`,
        recommendation: "Add descriptive alt text to all images for accessibility and SEO.",
        impact: "medium",
        difficulty: "easy",
        priority: 6,
      })
    }

    // HTTPS check
    if (!this.url.startsWith("https://")) {
      issues.push({
        id: "not-https",
        category: "security",
        severity: "critical",
        title: "Not Using HTTPS",
        description: "The website is not using HTTPS, which affects security and SEO rankings.",
        recommendation: "Implement SSL certificate and redirect all HTTP traffic to HTTPS.",
        impact: "high",
        difficulty: "medium",
        priority: 1,
      })
    }

    if (!metadata.viewport) {
      issues.push({
        id: "missing-viewport",
        category: "technical",
        severity: "warning",
        title: "Missing Viewport Meta Tag",
        description: "The page is missing a viewport meta tag for mobile responsiveness.",
        recommendation: 'Add <meta name="viewport" content="width=device-width, initial-scale=1"> to the head.',
        impact: "medium",
        difficulty: "easy",
        priority: 7,
      })
    }

    if (!metadata.canonical) {
      issues.push({
        id: "missing-canonical",
        category: "technical",
        severity: "info",
        title: "Missing Canonical URL",
        description: "The page is missing a canonical URL tag.",
        recommendation: "Add a canonical URL to prevent duplicate content issues.",
        impact: "low",
        difficulty: "easy",
        priority: 10,
      })
    }

    if (!metadata.ogTitle || !metadata.ogDescription) {
      issues.push({
        id: "missing-open-graph",
        category: "on-page",
        severity: "info",
        title: "Missing Open Graph Tags",
        description: "Missing Open Graph tags for better social media sharing.",
        recommendation: "Add og:title, og:description, and og:image meta tags.",
        impact: "medium",
        difficulty: "easy",
        priority: 8,
      })
    }

    // Structured data check
    if (technicalDetails.structuredData.length === 0) {
      issues.push({
        id: "missing-structured-data",
        category: "technical",
        severity: "info",
        title: "Missing Structured Data",
        description: "No structured data (JSON-LD) found on the page.",
        recommendation: "Add relevant structured data markup to help search engines understand your content.",
        impact: "medium",
        difficulty: "medium",
        priority: 9,
      })
    }

    return issues.sort((a, b) => (a.priority || 999) - (b.priority || 999))
  }

  private calculateScore(issues: SEOIssue[]): SEOScore {
    let technicalScore = 100
    let onPageScore = 100
    let contentScore = 100
    let performanceScore = 100
    let accessibilityScore = 100
    let securityScore = 100

    issues.forEach((issue) => {
      const penalty = issue.severity === "critical" ? 20 : issue.severity === "warning" ? 10 : 5

      switch (issue.category) {
        case "technical":
          technicalScore = Math.max(0, technicalScore - penalty)
          break
        case "on-page":
          onPageScore = Math.max(0, onPageScore - penalty)
          break
        case "content":
          contentScore = Math.max(0, contentScore - penalty)
          break
        case "performance":
          performanceScore = Math.max(0, performanceScore - penalty)
          break
        case "accessibility":
          accessibilityScore = Math.max(0, accessibilityScore - penalty)
          break
        case "security":
          securityScore = Math.max(0, securityScore - penalty)
          break
      }
    })

    const overall = Math.round(
      (technicalScore + onPageScore + contentScore + performanceScore + accessibilityScore + securityScore) / 6,
    )

    return {
      overall,
      technical: technicalScore,
      onPage: onPageScore,
      content: contentScore,
      performance: performanceScore,
      accessibility: accessibilityScore,
      security: securityScore,
    }
  }

  private analyzePerformance(): PerformanceMetrics {
    // Simulate performance metrics (in real implementation, this would use actual data)
    const scripts = this.document.querySelectorAll("script").length
    const stylesheets = this.document.querySelectorAll('link[rel="stylesheet"]').length
    const images = this.document.querySelectorAll("img").length

    return {
      loadTime: Math.round(1000 + scripts * 100 + stylesheets * 50 + images * 20),
      pageSize: Math.round(50000 + scripts * 5000 + stylesheets * 3000 + images * 10000),
      requests: scripts + stylesheets + images + 5,
      firstContentfulPaint: Math.round(800 + Math.random() * 400),
      largestContentfulPaint: Math.round(1200 + Math.random() * 800),
      cumulativeLayoutShift: Math.round(Math.random() * 0.25 * 100) / 100,
      firstInputDelay: Math.round(50 + Math.random() * 100),
      timeToInteractive: Math.round(1500 + Math.random() * 1000),
    }
  }
}
