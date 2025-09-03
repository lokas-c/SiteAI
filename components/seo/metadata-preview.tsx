import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import type { MetaData } from "@/lib/types"
import { cn } from "@/lib/utils"
import { ExternalLink, ImageIcon, Share2 } from "lucide-react"

interface MetadataPreviewProps {
  metadata: MetaData
  url: string
  className?: string
}

export function MetadataPreview({ metadata, url, className }: MetadataPreviewProps) {
  const domain = new URL(url).hostname

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
          <Share2 className="w-5 h-5" />
          Search Result Preview
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Google Search Result Preview */}
        <div className="border rounded-lg p-4 bg-muted/20">
          <h3 className="text-sm font-medium text-muted-foreground mb-3">Google Search Result</h3>
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm">
              <div className="w-4 h-4 bg-muted rounded-sm flex items-center justify-center">
                <ExternalLink className="w-2 h-2" />
              </div>
              <span className="text-muted-foreground">{domain}</span>
            </div>
            <h4 className="text-blue-600 text-lg hover:underline cursor-pointer line-clamp-2">
              {metadata.title || "Untitled Page"}
            </h4>
            <p className="text-sm text-muted-foreground line-clamp-2">
              {metadata.description || "No description available for this page."}
            </p>
          </div>
        </div>

        {/* Social Media Preview */}
        {(metadata.ogTitle || metadata.ogDescription || metadata.ogImage) && (
          <div className="border rounded-lg p-4 bg-muted/20">
            <h3 className="text-sm font-medium text-muted-foreground mb-3">Social Media Preview</h3>
            <div className="border rounded-lg overflow-hidden bg-background">
              {metadata.ogImage && (
                <div className="aspect-video bg-muted flex items-center justify-center">
                  <ImageIcon className="w-8 h-8 text-muted-foreground" />
                </div>
              )}
              <div className="p-3 space-y-1">
                <p className="text-xs text-muted-foreground uppercase tracking-wide">{domain}</p>
                <h4 className="font-medium text-sm line-clamp-2">
                  {metadata.ogTitle || metadata.title || "Untitled Page"}
                </h4>
                <p className="text-xs text-muted-foreground line-clamp-2">
                  {metadata.ogDescription || metadata.description || "No description available."}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Metadata Details */}
        <div className="space-y-3">
          <h3 className="text-sm font-medium text-foreground">Metadata Details</h3>
          <div className="grid gap-2">
            <MetadataItem
              label="Title Length"
              value={metadata.title?.length || 0}
              status={getMetaStatus("title", metadata.title?.length || 0)}
            />
            <MetadataItem
              label="Description Length"
              value={metadata.description?.length || 0}
              status={getMetaStatus("description", metadata.description?.length || 0)}
            />
            <MetadataItem
              label="Open Graph"
              value={metadata.ogTitle ? "Configured" : "Missing"}
              status={metadata.ogTitle ? "good" : "warning"}
            />
            <MetadataItem
              label="Canonical URL"
              value={metadata.canonical ? "Set" : "Missing"}
              status={metadata.canonical ? "good" : "info"}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

function MetadataItem({
  label,
  value,
  status,
}: {
  label: string
  value: string | number
  status: "good" | "warning" | "error" | "info"
}) {
  const getStatusColor = () => {
    switch (status) {
      case "good":
        return "text-green-600"
      case "warning":
        return "text-yellow-600"
      case "error":
        return "text-red-600"
      case "info":
        return "text-blue-600"
    }
  }

  return (
    <div className="flex items-center justify-between text-sm">
      <span className="text-muted-foreground">{label}</span>
      <Badge variant="outline" className={cn("text-xs", getStatusColor())}>
        {value}
      </Badge>
    </div>
  )
}

function getMetaStatus(type: "title" | "description", length: number) {
  if (type === "title") {
    if (length === 0) return "error"
    if (length < 30 || length > 60) return "warning"
    return "good"
  }

  if (type === "description") {
    if (length === 0) return "error"
    if (length < 120 || length > 160) return "warning"
    return "good"
  }

  return "info"
}
