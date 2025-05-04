"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Search, Package } from "lucide-react"
import { toast } from "sonner"

export default function TrackPackageForm({ className }: { className?: string }) {
  const [tracking_number, settracking_number] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!tracking_number.trim()) {
      toast.error("Please enter a tracking number")
      return
    }

    setIsLoading(true)
    // Navigate to the tracking page with the tracking number as a query parameter
    router.push(`/track?tracking=${encodeURIComponent(tracking_number.trim())}`)
  }

  return (
    <Card className={className}>
      <CardHeader>
        <div className="flex items-center justify-center mb-4">
          <div className="bg-primary/10 p-3 rounded-full">
            <Package className="h-8 w-8 text-primary" />
          </div>
        </div>
        <CardTitle className="text-center">Track Your Package</CardTitle>
        <CardDescription className="text-center">
          Enter your tracking number to get real-time updates on your shipment
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Input
              id="tracking_number"
              placeholder="Enter tracking number"
              value={tracking_number}
              onChange={(e) => settracking_number(e.target.value)}
              className="w-full"
              required
            />
          </div>
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? (
              "Loading..."
            ) : (
              <>
                <Search className="mr-2 h-4 w-4" /> Track Package
              </>
            )}
          </Button>
        </form>
      </CardContent>
      <CardFooter className="flex flex-col text-xs text-muted-foreground">
        <p>Example tracking numbers: DU1234567890, DU9876543210</p>
      </CardFooter>
    </Card>
  )
}
