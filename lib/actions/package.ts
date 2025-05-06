import { createClient } from "@/lib/supabase/server"
import { PackageData } from "@/types"

// Helper function to get status text
const getStatusText = (status: string) => {
  switch (status) {
    case "in_warehouse":
      return "In Warehouse"
    case "in_transit":
      return "In Transit"
    case "arrived":
      return "Arrived"
    case "customs_check":
      return "Customs Check"
    case "customs_hold":
      return "Customs Clearance (ON HOLD)"
    case "delivered":
      return "Delivered"
    case "pending":
      return "Pending"
    case "exception":
      return "Exception"
    default:
      return status.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase())
  }
}

export async function getPackageById(tracking_number: string): Promise<PackageData | null> {
  const supabase = createClient()

  const { data, error } = await supabase
    .from("packages")
    .select(`
      id,
      tracking_number,
      status,
      description,
      weight,
      dimensions,
      sender,
      recipient,
      payment,
      current_location,
      images,
      checkpoints,
      created_at,
      updated_at,
      admin_id,
      package_type,
      date_shipped,
      ship_date,
      estimated_delivery_date,
      show_payment_section,
      payment_visibility,
      pdfs
    `)
    .eq("tracking_number", tracking_number)
    .single()

  if (error) {
    console.error("Error fetching package:", error)
    return null
  }

  if (!data) return null

  return {
    ...data,
    package_type: data.package_type || 'Standard',
    date_shipped: data.date_shipped || '',
    ship_date: data.ship_date || '',
    estimated_delivery_date: data.estimated_delivery_date || '',
    statusText: getStatusText(data.status)
  }
} 