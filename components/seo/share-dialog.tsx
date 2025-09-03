"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent } from "@/components/ui/card"
import type { SEOAuditResult } from "@/lib/types"
import { Share2, Copy, Check, ExternalLink } from "lucide-react"

interface ShareDialogProps {
  auditResult: SEOAuditResult
  children?: React.ReactNode
}

export function ShareDialog({ auditResult, children }: ShareDialogProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [isGenerating, setIsGenerating] = useState(false)
  const [shareUrl, setShareUrl] = useState<string | null>(null)
  const [copied, setCopied] = useState(false)
  const [expiresAt, setExpiresAt] = useState<string | null>(null)

  const generateShareLink = async () => {
    setIsGenerating(true)
    try {
      const response = await fetch("/api/share", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ auditResult }),
      })

      if (!response.ok) {
        throw new Error("Failed to create share link")
      }

      const data = await response.json()
      setShareUrl(data.shareUrl)
      setExpiresAt(data.expiresAt)
    } catch (error) {
      console.error("Share generation failed:", error)
      // In a real app, you'd show a toast notification here
    } finally {
      setIsGenerating(false)
    }
  }

  const copyToClipboard = async () => {
    if (!shareUrl) return

    try {
      await navigator.clipboard.writeText(shareUrl)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (error) {
      console.error("Failed to copy to clipboard:", error)
    }
  }

  const openInNewTab = () => {
    if (shareUrl) {
      window.open(shareUrl, "_blank")
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {children || (
          <Button variant="outline" size="sm">
            <Share2 className="w-4 h-4 mr-2" />
            Share Report
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Share SEO Report</DialogTitle>
          <DialogDescription>Create a shareable link to this audit report that others can view.</DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {!shareUrl ? (
            <Card>
              <CardContent className="p-6 text-center space-y-4">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto">
                  <Share2 className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-medium text-foreground mb-2">Generate Share Link</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Create a secure link that allows others to view this audit report. The link will expire in 30 days.
                  </p>
                </div>
                <Button onClick={generateShareLink} disabled={isGenerating} className="w-full">
                  {isGenerating ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Generating Link...
                    </>
                  ) : (
                    <>
                      <Share2 className="w-4 h-4 mr-2" />
                      Create Share Link
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Share URL</Label>
                <div className="flex gap-2">
                  <Input value={shareUrl} readOnly className="font-mono text-sm" />
                  <Button variant="outline" size="sm" onClick={copyToClipboard} className="shrink-0 bg-transparent">
                    {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                  </Button>
                </div>
              </div>

              {expiresAt && (
                <p className="text-sm text-muted-foreground">
                  This link will expire on {new Date(expiresAt).toLocaleDateString()}
                </p>
              )}

              <div className="flex gap-2">
                <Button onClick={openInNewTab} className="flex-1">
                  <ExternalLink className="w-4 h-4 mr-2" />
                  Open Link
                </Button>
                <Button variant="outline" onClick={copyToClipboard} className="flex-1 bg-transparent">
                  {copied ? (
                    <>
                      <Check className="w-4 h-4 mr-2" />
                      Copied!
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4 mr-2" />
                      Copy Link
                    </>
                  )}
                </Button>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
