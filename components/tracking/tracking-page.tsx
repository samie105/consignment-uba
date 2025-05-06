import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { format, isToday, isYesterday, parseISO } from "date-fns"
import { RefreshCw } from "lucide-react"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"

interface TrackingPageProps {
  tracking_number: string
  packageData: any
}

export function TrackingPage({ tracking_number, packageData }: TrackingPageProps) {
  const router = useRouter()
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [data, setData] = useState(packageData)

  const formatDate = (dateString: string) => {
    const date = parseISO(dateString)
    if (isToday(date)) {
      return `Today at ${format(date, "h:mm a")}`
    } else if (isYesterday(date)) {
      return `Yesterday at ${format(date, "h:mm a")}`
    } else {
      return format(date, "MMM d, yyyy 'at' h:mm a")
    }
  }

  const refreshData = async () => {
    setIsRefreshing(true)
    try {
      const response = await fetch(`/api/tracking/${tracking_number}`)
      if (!response.ok) throw new Error("Failed to fetch data")
      const newData = await response.json()
      setData(newData)
      toast.success("Tracking information updated")
    } catch (error) {
      toast.error("Failed to update tracking information")
    } finally {
      setIsRefreshing(false)
    }
  }

  // Auto-refresh every 30 seconds
  useEffect(() => {
    const interval = setInterval(refreshData, 30000)
    return () => clearInterval(interval)
  }, [tracking_number])

  if (!data) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <p className="text-muted-foreground">No tracking information available</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Tracking Information</h1>
        <Button
          variant="outline"
          size="sm"
          onClick={refreshData}
          disabled={isRefreshing}
        >
          <RefreshCw className={`mr-2 h-4 w-4 ${isRefreshing ? "animate-spin" : ""}`} />
          {isRefreshing ? "Refreshing..." : "Refresh"}
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Package Details</CardTitle>
          <CardDescription>Tracking number: {tracking_number}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Status</p>
                <p className="font-medium">{data.status}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Last Updated</p>
                <p className="font-medium">{formatDate(data.updated_at)}</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Tracking History</CardTitle>
          <CardDescription>Recent updates and checkpoints</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {data.checkpoints?.map((checkpoint: any, index: number) => (
              <div
                key={checkpoint.id}
                className={`relative pl-6 ${
                  index !== data.checkpoints.length - 1 ? "pb-6" : ""
                }`}
              >
                <div className="absolute left-0 top-0 h-full w-0.5 bg-muted" />
                <div className="absolute left-0 top-0 h-3 w-3 rounded-full bg-primary" />
                <div className="space-y-1">
                  <p className="font-medium">{checkpoint.location}</p>
                  <p className="text-sm text-muted-foreground">
                    {checkpoint.description}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {formatDate(checkpoint.timestamp)}
                    {checkpoint.customTime && (
                      <span className="ml-2 text-xs text-primary">
                        (Custom Time)
                      </span>
                    )}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
} 