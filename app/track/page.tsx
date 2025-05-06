import { TrackingDetails } from "@/components/track/tracking-details"
import TrackPackageForm from "@/components/track-package-form"
import { getPackageById } from "@/lib/actions/package"

export const metadata = {
  title: "Track Your Package | DeliveryUno",
  description: "Track your package in real-time with DeliveryUno's tracking system.",
}

type SearchParams = { [key: string]: string | string[] | undefined }

export default async function TrackPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>
}) {
  // Await searchParams to get the actual values
  const params = await searchParams

  // Get tracking number from params
  const tracking = params.tracking
  const tracking_number = typeof tracking === "string" ? tracking : undefined

  // Fetch package data if tracking number exists
  const packageData = tracking_number ? await getPackageById(tracking_number) : null

  return (
    <main className="min-h-screen py-16">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center justify-center space-y-4 text-center mb-8">
          <div className="space-y-2">
            <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">Track Your Package</h1>
            <p className="max-w-[700px] text-muted-foreground md:text-xl/relaxed">
              Enter your tracking number to get real-time updates on your shipment.
            </p>
          </div>
        </div>

        {!tracking_number ? (
          <div className="max-w-md mx-auto">
            <TrackPackageForm />
          </div>
        ) : packageData ? (
          <TrackingDetails packageData={packageData} />
        ) : (
          <div className="text-center">
            <p className="text-muted-foreground">No package found with tracking number: {tracking_number}</p>
          </div>
        )}
      </div>
    </main>
  )
}
