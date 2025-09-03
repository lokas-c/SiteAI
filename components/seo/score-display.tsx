import { cn, formatScore, getScoreColor } from "@/lib/utils"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import type { SEOScore } from "@/lib/types"

interface ScoreDisplayProps {
  score: SEOScore
  className?: string
  showDetails?: boolean
}

export function ScoreDisplay({ score, className, showDetails = true }: ScoreDisplayProps) {
  return (
    <Card className={cn("text-center", className)}>
      <CardHeader className="pb-4 sm:pb-6">
        <CardTitle className="text-base sm:text-lg">SEO Score</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4 sm:space-y-6">
        {/* Overall Score Circle */}
        <div className="relative mx-auto w-24 h-24 sm:w-32 sm:h-32">
          <svg className="w-24 h-24 sm:w-32 sm:h-32 transform -rotate-90" viewBox="0 0 120 120">
            {/* Background circle */}
            <circle
              cx="60"
              cy="60"
              r="50"
              stroke="currentColor"
              strokeWidth="8"
              fill="none"
              className="text-muted/20"
            />
            {/* Progress circle */}
            <circle
              cx="60"
              cy="60"
              r="50"
              stroke="currentColor"
              strokeWidth="8"
              fill="none"
              strokeDasharray={`${(score.overall / 100) * 314} 314`}
              className={cn("transition-all duration-1000 ease-out", getScoreColor(score.overall))}
              strokeLinecap="round"
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-2xl sm:text-3xl font-bold text-foreground">{score.overall}</span>
            <span className="text-xs sm:text-sm text-muted-foreground">/ 100</span>
          </div>
        </div>

        <Badge variant="outline" className={cn("text-xs sm:text-sm", getScoreColor(score.overall))}>
          {formatScore(score.overall)}
        </Badge>

        {showDetails && (
          <div className="grid grid-cols-2 gap-3 sm:gap-4 text-sm">
            <ScoreItem label="Technical" score={score.technical} />
            <ScoreItem label="On-Page" score={score.onPage} />
            <ScoreItem label="Content" score={score.content} />
            <ScoreItem label="Performance" score={score.performance} />
          </div>
        )}
      </CardContent>
    </Card>
  )
}

function ScoreItem({ label, score }: { label: string; score: number }) {
  return (
    <div className="flex flex-col items-center space-y-1">
      <div className="w-full bg-muted rounded-full h-2">
        <div
          className={cn(
            "h-2 rounded-full transition-all duration-700 ease-out",
            getScoreColor(score).replace("text-", "bg-"),
          )}
          style={{ width: `${score}%` }}
        />
      </div>
      <span className="text-xs text-muted-foreground text-center">{label}</span>
      <span className={cn("text-xs font-medium", getScoreColor(score))}>{score}</span>
    </div>
  )
}
