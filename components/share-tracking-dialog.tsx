"use client"

import { useState } from "react"
import { Share2 } from "lucide-react"
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
import { toast } from "@/hooks/use-toast"

export default function ShareTrackingDialog({ tracking_number }: { tracking_number: string }) {
  const [copied, setCopied] = useState(false)
  const trackingUrl =
    typeof window !== "undefined"
      ? `${window.location.origin}/track?tracking=${tracking_number}`
      : `/track?tracking=${tracking_number}`

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(trackingUrl)
      setCopied(true)
      toast({
        title: "Copied to clipboard",
        description: "Tracking link has been copied to your clipboard.",
      })
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      toast({
        title: "Failed to copy",
        description: "Please try again or copy the link manually.",
        variant: "destructive",
      })
    }
  }

  const shareViaEmail = () => {
    const subject = encodeURIComponent(`Track Package ${tracking_number}`)
    const body = encodeURIComponent(
      `Hello,\n\nYou can track the package with tracking number ${tracking_number} using this link:\n${trackingUrl}\n\nRegards,`,
    )
    window.location.href = `mailto:?subject=${subject}&body=${body}`
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="flex items-center gap-1">
          <Share2 className="h-4 w-4" />
          <span>Share</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Share tracking information</DialogTitle>
          <DialogDescription>Share this tracking link with others to let them track this package.</DialogDescription>
        </DialogHeader>
        <div className="flex items-center space-x-2 mt-4">
          <div className="grid flex-1 gap-2">
            <Input
              readOnly
              value={trackingUrl}
              className="w-full"
              onClick={(e) => (e.target as HTMLInputElement).select()}
            />
          </div>
          <Button type="submit" size="sm" onClick={copyToClipboard}>
            {copied ? "Copied" : "Copy"}
          </Button>
        </div>
        <div className="mt-6 flex flex-col sm:flex-row gap-2">
          <Button variant="outline" className="flex-1" onClick={shareViaEmail}>
            Share via Email
          </Button>
          <Button
            variant="outline"
            className="flex-1"
            onClick={() => {
              if (navigator.share) {
                navigator
                  .share({
                    title: `Track Package ${tracking_number}`,
                    text: `Track package with tracking number ${tracking_number}`,
                    url: trackingUrl,
                  })
                  .catch((err) => console.error("Error sharing:", err))
              } else {
                toast({
                  title: "Sharing not supported",
                  description: "Your browser doesn't support the Web Share API.",
                })
              }
            }}
          >
            Share via...
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
