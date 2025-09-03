"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import { Lightbulb, Sparkles } from "lucide-react"
import { useState } from "react"

interface InsightsDisplayProps {
  insights: string[]
  className?: string
  title?: string
  animated?: boolean
}

export function InsightsDisplay({
  insights,
  className,
  title = "AI-Powered Insights",
  animated = true,
}: InsightsDisplayProps) {
  const [visibleInsights, setVisibleInsights] = useState(animated ? 0 : insights.length)

  // Animate insights reveal
  useState(() => {
    if (animated && insights.length > 0) {
      const timer = setInterval(() => {
        setVisibleInsights((prev) => {
          if (prev >= insights.length) {
            clearInterval(timer)
            return prev
          }
          return prev + 1
        })
      }, 300)
      return () => clearInterval(timer)
    }
  })

  if (insights.length === 0) {
    return (
      <Card className={cn("border-dashed", className)}>
        <CardContent className="flex flex-col items-center justify-center py-12 text-center">
          <Lightbulb className="w-12 h-12 text-muted-foreground mb-4" />
          <p className="text-muted-foreground">No insights available yet</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className={className}>
      <CardHeader>
        <div className="flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-primary" />
          <CardTitle className="text-lg">{title}</CardTitle>
          <Badge variant="secondary" className="ml-auto">
            {insights.length} insights
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {insights.slice(0, visibleInsights).map((insight, index) => (
            <InsightItem key={index} insight={insight} index={index} animated={animated} />
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

function InsightItem({
  insight,
  index,
  animated,
}: {
  insight: string
  index: number
  animated: boolean
}) {
  return (
    <div
      className={cn(
        "flex gap-3 p-4 rounded-lg bg-muted/30 border border-border/50",
        animated && "animate-in slide-in-from-left-2 fade-in duration-500",
      )}
      style={animated ? { animationDelay: `${index * 100}ms` } : undefined}
    >
      <div className="flex-shrink-0 w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center mt-0.5">
        <span className="text-xs font-medium text-primary">{index + 1}</span>
      </div>
      <p className="text-sm leading-relaxed text-foreground flex-1">{insight}</p>
    </div>
  )
}
