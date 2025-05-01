import TrackPageClient from "./TrackPageClient"

// Instead of:
// const RealPackageMap = dynamic(() => import("@/components/map/real-package-map"), { ssr: false })

// Rest of the file...

export const metadata = {
  title: "Track Your Package | DeliveryUno",
  description: "Track your package in real-time with DeliveryUno's tracking system.",
}

export default function TrackPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined }
}) {
  const trackingNumber = typeof searchParams.tracking === "string" ? searchParams.tracking : undefined

  return <TrackPageClient trackingNumber={trackingNumber} />
}
