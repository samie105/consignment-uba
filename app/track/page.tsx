import TrackPageClient from "./TrackPageClient"

export const metadata = {
  title: "Track Your Package | DeliveryUno",
  description: "Track your package in real-time with DeliveryUno's tracking system.",
}

export default async function TrackPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined }
}) {
  // Await searchParams as required
  const track = await searchParams
  const tracking_number = typeof track.tracking === "string" ? track.tracking : undefined

  return <TrackPageClient tracking_number={tracking_number} />
}
