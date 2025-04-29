import { createClient } from "@supabase/supabase-js"

// These would come from environment variables in production
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "your-supabase-url"
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "your-supabase-anon-key"

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Database schema types
export type Package = {
  id: string
  tracking_number: string
  status: string
  description: string
  weight: number
  dimensions: {
    length: number
    width: number
    height: number
  }
  sender: {
    full_name: string
    email: string
    phone: string
    address: string
  }
  recipient: {
    full_name: string
    email: string
    phone: string
    address: string
  }
  payment: {
    amount: number
    is_paid: boolean
    method: string
  }
  current_location: {
    lat: number
    lng: number
    address: string
  } | null
  created_at: string
}

export type Checkpoint = {
  id: string
  package_id: string
  location: string
  description: string
  timestamp: string
  status: string
  coordinates: {
    lat: number
    lng: number
  } | null
}

export type PackageImage = {
  id: string
  package_id: string
  url: string
  created_at: string
}
