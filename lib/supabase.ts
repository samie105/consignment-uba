import { createClient as supabaseCreateClient } from "@supabase/supabase-js"

// Get environment variables with fallbacks
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

// Check if credentials are available
const hasCredentials = supabaseUrl && supabaseAnonKey

// Create a function to get the client
export const createClient = () => {
  if (!hasCredentials) {
    console.warn(
      "Supabase credentials are missing. Please set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY environment variables.",
    )
    // Return a dummy client that will throw clear errors
    return {
      from: () => ({
        select: () => Promise.reject(new Error("Supabase credentials are missing")),
        insert: () => Promise.reject(new Error("Supabase credentials are missing")),
        update: () => Promise.reject(new Error("Supabase credentials are missing")),
        delete: () => Promise.reject(new Error("Supabase credentials are missing")),
      }),
      storage: {
        from: () => ({
          upload: () => Promise.reject(new Error("Supabase credentials are missing")),
          getPublicUrl: () => ({ data: { publicUrl: "" } }),
          remove: () => Promise.reject(new Error("Supabase credentials are missing")),
        }),
        listBuckets: () => Promise.reject(new Error("Supabase credentials are missing")),
      },
      auth: {
        signInWithPassword: () => Promise.reject(new Error("Supabase credentials are missing")),
        signOut: () => Promise.reject(new Error("Supabase credentials are missing")),
      },
    } as any
  }

  return supabaseCreateClient(supabaseUrl, supabaseAnonKey)
}

// Create a reusable client
export const supabase = createClient()

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
