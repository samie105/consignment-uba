import { createClient as supabaseCreateClient } from "@supabase/supabase-js"

// Get the Supabase URL and key from environment variables
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

// Check if the environment variables are set
if (!supabaseUrl || !supabaseKey) {
  console.error(
    "Supabase credentials are missing. Please set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY environment variables.",
  )
}

// Create the Supabase client
export const supabase = supabaseCreateClient(supabaseUrl || "", supabaseKey || "")

// Log initialization status
console.log(`Supabase client initialized with URL: ${supabaseUrl ? "Valid URL" : "Missing URL"}`)

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

export const createClient = supabaseCreateClient
