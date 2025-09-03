import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { cn } from "@/lib/utils"
import { Check, Loader2, Clock, AlertCircle } from "lucide-react"

interface AuditStep {
  id: string
  label: string
  status: "pending" | "running" | "completed" | "error"
  description?: string
}

interface AuditProgressProps {
  steps: AuditStep[]
  className?: string
  currentStep?: string
}

export function AuditProgress({ steps, className, currentStep }: AuditProgressProps) {
  const completedSteps = steps.filter((step) => step.status === "completed").length
  const totalSteps = steps.length
  const progressPercentage = (completedSteps / totalSteps) * 100

  const isRunning = steps.some((step) => step.status === "running")
  const hasErrors = steps.some((step) => step.status === "error")

  return (
    <Card className={className}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">Audit Progress</CardTitle>
          <Badge variant={hasErrors ? "destructive" : isRunning ? "secondary" : "default"}>
            {hasErrors ? "Error" : isRunning ? "Running" : "Complete"}
          </Badge>
        </div>
        <Progress value={progressPercentage} className="w-full" />
        <p className="text-sm text-muted-foreground">
          {completedSteps} of {totalSteps} steps completed
        </p>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {steps.map((step, index) => (
            <StepItem
              key={step.id}
              step={step}
              isActive={step.id === currentStep}
              isLast={index === steps.length - 1}
            />
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

function StepItem({
  step,
  isActive,
  isLast,
}: {
  step: AuditStep
  isActive: boolean
  isLast: boolean
}) {
  const getStatusIcon = () => {
    switch (step.status) {
      case "completed":
        return <Check className="w-4 h-4 text-green-600" />
      case "running":
        return <Loader2 className="w-4 h-4 text-blue-600 animate-spin" />
      case "error":
        return <AlertCircle className="w-4 h-4 text-red-600" />
      case "pending":
        return <Clock className="w-4 h-4 text-muted-foreground" />
    }
  }

  const getStatusColor = () => {
    switch (step.status) {
      case "completed":
        return "border-green-200 bg-green-50"
      case "running":
        return "border-blue-200 bg-blue-50"
      case "error":
        return "border-red-200 bg-red-50"
      case "pending":
        return "border-muted bg-muted/20"
    }
  }

  return (
    <div className="flex items-start gap-3">
      <div
        className={cn(
          "flex items-center justify-center w-8 h-8 rounded-full border-2 transition-colors",
          getStatusColor(),
          isActive && "ring-2 ring-primary/20",
        )}
      >
        {getStatusIcon()}
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <p
            className={cn(
              "font-medium text-sm",
              step.status === "completed"
                ? "text-green-700"
                : step.status === "running"
                  ? "text-blue-700"
                  : step.status === "error"
                    ? "text-red-700"
                    : "text-muted-foreground",
            )}
          >
            {step.label}
          </p>
          {isActive && (
            <Badge variant="outline" className="text-xs">
              Current
            </Badge>
          )}
        </div>
        {step.description && <p className="text-xs text-muted-foreground mt-1">{step.description}</p>}
      </div>

      {!isLast && <div className="absolute left-4 mt-8 w-px h-6 bg-border" />}
    </div>
  )
}
