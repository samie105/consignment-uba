export interface PackageData {
  id: string
  tracking_number: string
  status: string
  description: string
  weight: string
  dimensions: {
    width: number
    height: number
    length: number
  }
  sender: {
    name: string
    email: string
    phone: string
    address: string
    fullName: string
  }
  recipient: {
    name: string
    email: string
    phone: string
    address: string
    fullName: string
  }
  payment: {
    amount: number
    currency: string
    status: string
    isPaid?: boolean
    method?: string
  }
  current_location: {
    address: string
    latitude?: number
    longitude?: number
  }
  images: string[]
  checkpoints: {
    id: string
    status: string
    address?: string
    location: string
    timestamp: string
    customDate?: boolean
    customTime?: boolean
    coordinates?: {
      lat: number
      lng: number
    }
    description?: string
  }[]
  created_at: string
  updated_at: string
  admin_id: string
  package_type: string
  date_shipped: string
  ship_date: string
  estimated_delivery_date: string
  show_payment_section: boolean
  payment_visibility: boolean
  pdfs: string[]
  statusText: string
} 