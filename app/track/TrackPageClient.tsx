"use client"

import TrackPackageForm from "@/components/track-package-form"
import PackageTrackingDetails from "@/components/package-tracking-details"

export default function TrackPageClient({
  tracking_number,
}: {
  tracking_number?: string
}) {
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
        ) : (
          <PackageTrackingDetails tracking_number={tracking_number} />
        )}
      </div>
    </main>
  )
}
