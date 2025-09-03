import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Search, Zap, Shield, BarChart3, Globe, CheckCircle, Menu, MessageCircle, ExternalLink } from "lucide-react"
import Link from "next/link"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <BarChart3 className="w-5 h-5 text-primary-foreground" />
              </div>
              <h1 className="text-lg sm:text-xl font-bold text-foreground font-serif">SEO Audit Pro</h1>
            </div>
            <nav className="hidden md:flex items-center gap-6">
              <a href="#features" className="text-muted-foreground hover:text-foreground transition-colors">
                Features
              </a>
              <a href="#pricing" className="text-muted-foreground hover:text-foreground transition-colors">
                Pricing
              </a>
              <a
                href="https://t.me/drkingbd"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1"
              >
                <MessageCircle className="w-4 h-4" />
                Telegram
                <ExternalLink className="w-3 h-3" />
              </a>
              <Button variant="outline" size="sm">
                Sign In
              </Button>
            </nav>
            <Button variant="ghost" size="sm" className="md:hidden">
              <Menu className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-12 sm:py-16 lg:py-20 px-4">
        <div className="container mx-auto max-w-4xl text-center">
          <Badge variant="secondary" className="mb-4">
            <Zap className="w-3 h-3 mr-1" />
            AI-Powered Analysis
          </Badge>
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-4 sm:mb-6 font-serif text-balance">
            Professional SEO Audit Platform
          </h1>
          <p className="text-lg sm:text-xl text-muted-foreground mb-6 sm:mb-8 text-pretty max-w-2xl mx-auto leading-relaxed">
            Get comprehensive website analysis with AI-powered insights. Identify technical issues, optimize content,
            and boost your search rankings with actionable recommendations.
          </p>

          {/* URL Input */}
          <div className="max-w-md mx-auto mb-8">
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-2">
              <div className="relative flex-1">
                <Globe className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input placeholder="Enter website URL to audit..." className="pl-10 h-12 text-base" />
              </div>
              <Link href="/audit" className="w-full sm:w-auto">
                <Button size="lg" className="h-12 px-6 w-full sm:w-auto">
                  <Search className="w-4 h-4 mr-2" />
                  Audit Now
                </Button>
              </Link>
            </div>
            <p className="text-sm text-muted-foreground mt-3 px-2">
              Free analysis • No signup required • Results in 30 seconds
            </p>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section id="features" className="py-12 sm:py-16 px-4 bg-muted/30">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-8 sm:mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-4 font-serif">
              Comprehensive SEO Analysis
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              Our AI-powered platform analyzes every aspect of your website's SEO performance
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {[
              {
                icon: <BarChart3 className="w-6 h-6" />,
                title: "Technical SEO",
                description: "Core Web Vitals, page speed, mobile responsiveness, and technical optimization analysis",
              },
              {
                icon: <Search className="w-6 h-6" />,
                title: "On-Page SEO",
                description: "Meta tags, headers, content optimization, and keyword analysis with AI insights",
              },
              {
                icon: <Shield className="w-6 h-6" />,
                title: "Security & Performance",
                description: "HTTPS implementation, security headers, and performance optimization recommendations",
              },
              {
                icon: <Globe className="w-6 h-6" />,
                title: "Content Analysis",
                description: "AI-powered content quality assessment, readability scores, and improvement suggestions",
              },
              {
                icon: <CheckCircle className="w-6 h-6" />,
                title: "Actionable Insights",
                description: "Prioritized recommendations with implementation difficulty and impact scoring",
              },
              {
                icon: <Zap className="w-6 h-6" />,
                title: "Real-time Results",
                description: "Instant analysis with live screenshots and comprehensive reporting",
              },
            ].map((feature, index) => (
              <Card key={index} className="border-border hover:shadow-lg transition-shadow">
                <CardHeader className="pb-4">
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center text-primary mb-4">
                    {feature.icon}
                  </div>
                  <CardTitle className="text-lg">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-sm leading-relaxed">{feature.description}</CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-12 sm:py-16 lg:py-20 px-4">
        <div className="container mx-auto max-w-4xl text-center">
          <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-4 font-serif">
            Ready to Optimize Your Website?
          </h2>
          <p className="text-muted-foreground mb-6 sm:mb-8 max-w-2xl mx-auto leading-relaxed">
            Join thousands of professionals who trust our AI-powered SEO audit platform to improve their website
            performance and search rankings.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link href="/audit">
              <Button size="lg" className="h-12 px-8">
                Start Free Audit
              </Button>
            </Link>
            <a href="https://t.me/drkingbd" target="_blank" rel="noopener noreferrer">
              <Button variant="outline" size="lg" className="h-12 px-8 bg-transparent">
                <MessageCircle className="w-4 h-4 mr-2" />
                Join Our Telegram
              </Button>
            </a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border bg-muted/30 py-8 sm:py-12 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 bg-primary rounded flex items-center justify-center">
                <BarChart3 className="w-4 h-4 text-primary-foreground" />
              </div>
              <span className="font-bold text-foreground font-serif">SEO Audit Pro</span>
            </div>
            <div className="flex flex-col sm:flex-row items-center gap-4">
              <a
                href="https://t.me/drkingbd"
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1"
              >
                <MessageCircle className="w-4 h-4" />
                Join our Telegram
              </a>
              <p className="text-sm text-muted-foreground text-center sm:text-right">
                © 2024 SEO Audit Pro. Professional website analysis powered by AI.
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
