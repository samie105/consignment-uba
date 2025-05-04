import { createClient as supabaseCreateClient } from "@supabase/supabase-js"

// Get environment variables
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

// Create a function to get the client
export const createClient = () => {
  if (!supabaseUrl || !supabaseAnonKey) {
    console.error(
      "Supabase credentials are missing. Please set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY environment variables.",
    )

    // Return a mock client that will provide clear error messages
    return {
      from: () => ({
        select: () =>
          Promise.reject(
            new Error(
              "Supabase credentials are missing. Please set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY environment variables.",
            ),
          ),
        insert: () =>
          Promise.reject(
            new Error(
              "Supabase credentials are missing. Please set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY environment variables.",
            ),
          ),
        update: () =>
          Promise.reject(
            new Error(
              "Supabase credentials are missing. Please set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY environment variables.",
            ),
          ),
        delete: () =>
          Promise.reject(
            new Error(
              "Supabase credentials are missing. Please set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY environment variables.",
            ),
          ),
        eq: () => ({
          single: () =>
            Promise.reject(
              new Error(
                "Supabase credentials are missing. Please set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY environment variables.",
              ),
            ),
        }),
        order: () =>
          Promise.reject(
            new Error(
              "Supabase credentials are missing. Please set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY environment variables.",
            ),
          ),
      }),
      storage: {
        from: () => ({
          upload: () =>
            Promise.reject(
              new Error(
                "Supabase credentials are missing. Please set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY environment variables.",
              ),
            ),
          getPublicUrl: () => ({ data: { publicUrl: "" } }),
          remove: () =>
            Promise.reject(
              new Error(
                "Supabase credentials are missing. Please set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY environment variables.",
              ),
            ),
        }),
        listBuckets: () =>
          Promise.reject(
            new Error(
              "Supabase credentials are missing. Please set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY environment variables.",
            ),
          ),
      },
      auth: {
        signInWithPassword: () =>
          Promise.reject(
            new Error(
              "Supabase credentials are missing. Please set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY environment variables.",
            ),
          ),
        signOut: () =>
          Promise.reject(
            new Error(
              "Supabase credentials are missing. Please set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY environment variables.",
            ),
          ),
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
