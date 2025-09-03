import type React from "react"
import type { Metadata } from "next"
import { Playfair_Display, Source_Sans_3 } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import { Suspense } from "react"
import "./globals.css"

const playfairDisplay = Playfair_Display({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-playfair-display",
  weight: ["400", "700"],
})

const sourceSans = Source_Sans_3({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-source-sans",
  weight: ["400", "500", "600"],
})

export const metadata: Metadata = {
  metadataBase: new URL("https://siteai.pages.dev"),
  title: {
    default: "SEO Audit Pro - AI-Powered Website Analysis & Optimization",
    template: "%s | SEO Audit Pro",
  },
  description:
    "Professional AI-powered SEO audit platform. Get comprehensive website analysis, technical SEO insights, performance metrics, and actionable recommendations to boost your search rankings.",
  generator: "Next.js",
  applicationName: "SEO Audit Pro",
  referrer: "origin-when-cross-origin",
  keywords: [
    "SEO audit",
    "website analysis",
    "AI SEO",
    "technical SEO",
    "website optimization",
    "search engine optimization",
    "SEO tools",
    "website performance",
    "SEO checker",
    "on-page SEO",
    "technical analysis",
    "SEO insights",
    "website audit",
  ],
  authors: [{ name: "SEO Audit Pro Team" }],
  creator: "SEO Audit Pro",
  publisher: "SEO Audit Pro",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://siteai.pages.dev",
    title: "SEO Audit Pro - AI-Powered Website Analysis & Optimization",
    description:
      "Professional AI-powered SEO audit platform. Get comprehensive website analysis, technical SEO insights, and actionable recommendations.",
    siteName: "SEO Audit Pro",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "SEO Audit Pro - AI-Powered Website Analysis",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "SEO Audit Pro - AI-Powered Website Analysis",
    description: "Professional AI-powered SEO audit platform with comprehensive analysis and actionable insights.",
    images: ["/og-image.jpg"],
    creator: "@seoauditpro",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    google: "your-google-verification-code",
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={`${playfairDisplay.variable} ${sourceSans.variable}`}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "SoftwareApplication",
              name: "SEO Audit Pro",
              description: "Professional AI-powered SEO audit platform for comprehensive website analysis",
              url: "https://siteai.pages.dev",
              applicationCategory: "BusinessApplication",
              operatingSystem: "Web",
              offers: {
                "@type": "Offer",
                price: "0",
                priceCurrency: "USD",
              },
              aggregateRating: {
                "@type": "AggregateRating",
                ratingValue: "4.8",
                ratingCount: "1250",
              },
            }),
          }}
        />
        <link rel="canonical" href="https://siteai.pages.dev" />
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <meta name="theme-color" content="#0f766e" />
      </head>
      <body className="font-sans antialiased">
        <Suspense fallback={<div>Loading...</div>}>{children}</Suspense>
        <Analytics />
      </body>
    </html>
  )
}
