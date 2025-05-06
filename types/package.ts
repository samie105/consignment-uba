export interface Package {
  tracking_number: string
  status: 'pending' | 'in_warehouse' | 'in_transit' | 'arrived' | 'customs_check' | 'customs_hold' | 'delivered'
  description: string
  weight: number
  dimensions: {
    length: number
    width: number
    height: number
  }
  sender: {
    fullName: string
    email: string
    phone: string
    address: string
  }
  recipient: {
    fullName: string
    email: string
    phone: string
    address: string
  }
  payment: {
    amount: number
    isPaid: boolean
    method?: 'none' | 'Credit Card' | 'PayPal' | 'Bank Transfer' | 'Cash'
    isVisible?: boolean
  }
  images?: string[]
  pdfs?: string[]
  checkpoints: {
    id: string
    location: string
    description: string
    timestamp: string
    status: string
    coordinates?: {
      latitude: number
      longitude: number
    }
    customTime?: boolean
    customDate?: boolean
  }[]
  current_location: {
    latitude: number
    longitude: number
    address: string
  }
  admin_id: string
  created_at: string
  updated_at: string
  date_shipped?: string
  estimated_delivery_date?: string
  package_type?: 'standard' | 'express' | 'priority' | 'custom'
} 