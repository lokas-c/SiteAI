"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Globe, Search } from "lucide-react"
import { useRouter } from "next/navigation"

interface AuditFormProps {
  onSubmit?: (url: string) => void
  className?: string
  size?: "default" | "large"
}

export function AuditForm({ onSubmit, className, size = "default" }: AuditFormProps) {
  const [url, setUrl] = useState("")
  const router = useRouter()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!url.trim()) return

    if (onSubmit) {
      onSubmit(url)
    } else {
      // Navigate to audit page with URL as query parameter
      router.push(`/audit?url=${encodeURIComponent(url)}`)
    }
  }

  const inputHeight = size === "large" ? "h-12" : "h-10"
  const buttonHeight = size === "large" ? "h-12" : "h-10"

  return (
    <Card className={className}>
      <CardContent className="p-6">
        <form onSubmit={handleSubmit} className="flex gap-3">
          <div className="relative flex-1">
            <Globe className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input
              placeholder="https://example.com"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              className={`pl-10 ${inputHeight}`}
              type="url"
            />
          </div>
          <Button type="submit" disabled={!url.trim()} className={`px-6 ${buttonHeight}`}>
            <Search className="w-4 h-4 mr-2" />
            {size === "large" ? "Start Audit" : "Audit"}
          </Button>
        </form>
        <p className="text-sm text-muted-foreground mt-3 text-center">
          Free comprehensive analysis • Results in 30-60 seconds
        </p>
      </CardContent>
    </Card>
  )
}
