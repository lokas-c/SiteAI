"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { getSeverityColor, cn } from "@/lib/utils"
import type { SEOIssue } from "@/lib/types"
import { AlertTriangle, Info, XCircle, ChevronRight } from "lucide-react"

interface IssueCardProps {
  issue: SEOIssue
  className?: string
  onViewDetails?: (issue: SEOIssue) => void
}

export function IssueCard({ issue, className, onViewDetails }: IssueCardProps) {
  const getSeverityIcon = (severity: SEOIssue["severity"]) => {
    switch (severity) {
      case "critical":
        return <XCircle className="w-3 h-3 sm:w-4 sm:h-4" />
      case "warning":
        return <AlertTriangle className="w-3 h-3 sm:w-4 sm:h-4" />
      case "info":
        return <Info className="w-3 h-3 sm:w-4 sm:h-4" />
    }
  }

  const getImpactColor = (impact: SEOIssue["impact"]) => {
    switch (impact) {
      case "high":
        return "text-red-600"
      case "medium":
        return "text-yellow-600"
      case "low":
        return "text-blue-600"
    }
  }

  const getDifficultyColor = (difficulty: SEOIssue["difficulty"]) => {
    switch (difficulty) {
      case "easy":
        return "text-green-600"
      case "medium":
        return "text-yellow-600"
      case "hard":
        return "text-red-600"
    }
  }

  return (
    <Card className={cn("hover:shadow-md transition-shadow", className)}>
      <CardHeader className="pb-3">
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2">
          <div className="flex items-center gap-2 flex-wrap">
            <Badge variant="outline" className={cn("text-xs", getSeverityColor(issue.severity))}>
              {getSeverityIcon(issue.severity)}
              <span className="ml-1">{issue.severity}</span>
            </Badge>
            <Badge variant="secondary" className="text-xs">
              {issue.category}
            </Badge>
          </div>
          <div className="flex gap-2 flex-wrap">
            <Badge variant="outline" className={cn("text-xs", getImpactColor(issue.impact))}>
              {issue.impact} impact
            </Badge>
            <Badge variant="outline" className={cn("text-xs", getDifficultyColor(issue.difficulty))}>
              {issue.difficulty} fix
            </Badge>
          </div>
        </div>
        <CardTitle className="text-sm sm:text-base leading-tight">{issue.title}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm text-muted-foreground leading-relaxed">{issue.description}</p>

        <div className="bg-muted/50 rounded-lg p-3">
          <h4 className="text-sm font-medium text-foreground mb-2">Recommendation:</h4>
          <p className="text-sm text-muted-foreground leading-relaxed">{issue.recommendation}</p>
        </div>

        {onViewDetails && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onViewDetails(issue)}
            className="w-full justify-between text-xs sm:text-sm"
          >
            View Implementation Guide
            <ChevronRight className="w-3 h-3 sm:w-4 sm:h-4" />
          </Button>
        )}
      </CardContent>
    </Card>
  )
}
