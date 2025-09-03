import type React from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { formatBytes, formatDuration, cn } from "@/lib/utils"
import { Clock, HardDrive, Network } from "lucide-react"

interface PerformanceMetricsProps {
  performance: {
    loadTime: number
    pageSize: number
    requests: number
  }
  className?: string
}

export function PerformanceMetrics({ performance, className }: PerformanceMetricsProps) {
  const getLoadTimeStatus = (loadTime: number) => {
    if (loadTime < 1500) return { status: "excellent", color: "text-green-600" }
    if (loadTime < 2500) return { status: "good", color: "text-blue-600" }
    if (loadTime < 4000) return { status: "fair", color: "text-yellow-600" }
    return { status: "poor", color: "text-red-600" }
  }

  const getPageSizeStatus = (pageSize: number) => {
    if (pageSize < 500000) return { status: "excellent", color: "text-green-600" }
    if (pageSize < 1000000) return { status: "good", color: "text-blue-600" }
    if (pageSize < 2000000) return { status: "fair", color: "text-yellow-600" }
    return { status: "poor", color: "text-red-600" }
  }

  const getRequestsStatus = (requests: number) => {
    if (requests < 20) return { status: "excellent", color: "text-green-600" }
    if (requests < 50) return { status: "good", color: "text-blue-600" }
    if (requests < 100) return { status: "fair", color: "text-yellow-600" }
    return { status: "poor", color: "text-red-600" }
  }

  const loadTimeStatus = getLoadTimeStatus(performance.loadTime)
  const pageSizeStatus = getPageSizeStatus(performance.pageSize)
  const requestsStatus = getRequestsStatus(performance.requests)

  return (
    <Card className={className}>
      <CardHeader className="pb-4 sm:pb-6">
        <CardTitle className="text-base sm:text-lg">Performance Metrics</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4 sm:gap-6">
          <MetricItem
            icon={<Clock className="w-4 h-4 sm:w-5 sm:h-5" />}
            label="Load Time"
            value={formatDuration(performance.loadTime)}
            status={loadTimeStatus.status}
            color={loadTimeStatus.color}
            description="Time to fully load the page"
          />

          <MetricItem
            icon={<HardDrive className="w-4 h-4 sm:w-5 sm:h-5" />}
            label="Page Size"
            value={formatBytes(performance.pageSize)}
            status={pageSizeStatus.status}
            color={pageSizeStatus.color}
            description="Total size of all resources"
          />

          <MetricItem
            icon={<Network className="w-4 h-4 sm:w-5 sm:h-5" />}
            label="HTTP Requests"
            value={performance.requests.toString()}
            status={requestsStatus.status}
            color={requestsStatus.color}
            description="Number of network requests"
          />
        </div>
      </CardContent>
    </Card>
  )
}

function MetricItem({
  icon,
  label,
  value,
  status,
  color,
  description,
}: {
  icon: React.ReactNode
  label: string
  value: string
  status: string
  color: string
  description: string
}) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-3 sm:p-4 rounded-lg border border-border/50 bg-muted/20 gap-2 sm:gap-3">
      <div className="flex items-center gap-3">
        <div className={cn("p-2 rounded-lg bg-muted flex-shrink-0", color.replace("text-", "text-"))}>{icon}</div>
        <div className="min-w-0 flex-1">
          <p className="font-medium text-foreground text-sm sm:text-base">{label}</p>
          <p className="text-xs sm:text-sm text-muted-foreground">{description}</p>
        </div>
      </div>
      <div className="text-left sm:text-right flex-shrink-0">
        <p className="text-base sm:text-lg font-semibold text-foreground">{value}</p>
        <Badge variant="outline" className={cn("text-xs", color)}>
          {status}
        </Badge>
      </div>
    </div>
  )
}
