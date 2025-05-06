"use server"

import { createClient } from "@/lib/supabase"
import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import { createHash } from "crypto"

// Helper function to hash passwords
function hashPassword(password: string): string {
  return createHash("sha256").update(password).digest("hex")
}

// Login function
export async function login(formData: FormData) {
  console.log("=== Login Process Started ===")
  try {
    const email = formData.get("email") as string
    const password = formData.get("password") as string

    console.log("Form data received:", { email, passwordLength: password?.length })

    if (!email || !password) {
      console.log("Missing credentials")
      return { success: false, error: "Email and password are required" }
    }

    console.log("Creating Supabase client")
    const supabase = createClient()
    console.log("Supabase client created")

    // First, check if the user exists
    console.log("Checking user existence in database")
    const { data: userData, error: userError } = await supabase
      .from("admin_users")
      .select("*")
      .eq("email", email)
      .single()

    if (userError) {
      console.error("Database error:", userError)
      return { success: false, error: "Invalid email or password" }
    }

    if (!userData) {
      console.log("No user found with email:", email)
      return { success: false, error: "Invalid email or password" }
    }

    console.log("User found in database:", {
      id: userData.id,
      email: userData.email,
      role: userData.role,
      hasPassword: !!userData.password
    })

    // Check if the password matches (try both hashed and plain)
    console.log("Verifying password")
    const hashedPassword = hashPassword(password)
    const passwordMatches = userData.password === hashedPassword || userData.password === password

    if (!passwordMatches) {
      console.log("Password verification failed")
      return { success: false, error: "Invalid email or password" }
    }

    console.log("Password verified successfully")

    // Set a cookie with the user data
    try {
      console.log("Initializing cookie store")
    const cookieStore = await cookies()
      console.log("Cookie store initialized")

      const cookieData = {
        id: userData.id,
        email: userData.email,
        role: userData.role,
        name: userData.full_name || userData.name || userData.email.split('@')[0],
      }
      console.log("Preparing cookie data:", cookieData)

      const cookieOptions = {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax" as const,
        path: "/",
        maxAge: 60 * 60 * 24 * 7, // 1 week
      }
      console.log("Cookie options:", cookieOptions)

      cookieStore.set("admin", JSON.stringify(cookieData), cookieOptions)
      console.log("Cookie set successfully")
    } catch (cookieError: any) {
      console.error("Cookie error details:", {
        name: cookieError.name,
        message: cookieError.message,
        stack: cookieError.stack
      })
      throw cookieError
    }

    console.log("=== Login Process Completed Successfully ===")
    return { 
      success: true,
      user: {
        id: userData.id,
        email: userData.email,
        role: userData.role,
        name: userData.full_name || userData.name || userData.email.split('@')[0]
      }
    }
  } catch (error: any) {
    console.error("=== Login Process Failed ===")
    console.error("Error type:", error.constructor.name)
    console.error("Error message:", error.message)
    console.error("Error stack:", error.stack)
    console.error("Full error object:", error)
    
    // Return a more specific error message
    const errorMessage = error.message || "An unexpected error occurred"
    console.error("Returning error to client:", errorMessage)
    return { 
      success: false, 
      error: errorMessage,
      errorType: error.constructor.name
    }
  }
}

// Logout function
export async function logout() {
  const cookieStore = await cookies()
  cookieStore.delete("admin")
  redirect("/login")
}

// Check if the user is logged in
export async function getSession() {
  const cookieStore = await cookies()
  const admin = cookieStore.get("admin")

  if (!admin) {
    return null
  }

  try {
    const adminData = JSON.parse(admin.value)
    return adminData
  } catch (error) {
    return null
  }
}

// Create a new admin user
export async function createAdmin(formData: FormData) {
  try {
    const email = formData.get("email") as string
    const password = formData.get("password") as string
    const fullName = formData.get("fullName") as string

    if (!email || !password) {
      return { success: false, error: "Email and password are required" }
    }

    const supabase = createClient()

    // Check if the user already exists
    const { data: existingUser, error: checkError } = await supabase
      .from("admin_users")
      .select("*")
      .eq("email", email)
      .single()

    if (existingUser) {
      return { success: false, error: "User with this email already exists" }
    }

    // Hash the password
    const hashedPassword = hashPassword(password)

    // Insert the new admin
    const { data, error } = await supabase
      .from("admin_users")
      .insert({
        email,
        password: hashedPassword,
        full_name: fullName,
        role: "admin",
      })
      .select()
      .single()

    if (error) {
      console.error("Error creating admin:", error)
      return { success: false, error: error.message }
    }

    return { success: true, admin: data }
  } catch (error: any) {
    console.error("Unexpected error creating admin:", error)
    return { success: false, error: error.message || "An unexpected error occurred" }
  }
}

// Change password
export async function changePassword(currentPassword: string, newPassword: string) {
  try {
    if (!currentPassword || !newPassword) {
      return { success: false, error: "All fields are required" }
    }

    // Get the current admin
    const cookieStore = await cookies()
    const admin = cookieStore.get("admin")

    if (!admin) {
      return { success: false, error: "Not logged in" }
    }

    const adminData = JSON.parse(admin.value)
    const supabase = createClient()

    // Check the current password
    const hashedCurrentPassword = hashPassword(currentPassword)
    const { data: userData, error: userError } = await supabase
      .from("admin_users")
      .select("*")
      .eq("id", adminData.id)
      .single()

    if (userError || !userData) {
      console.error("Error fetching user:", userError)
      return { success: false, error: "User not found" }
    }

    if (userData.password !== hashedCurrentPassword) {
      return { success: false, error: "Current password is incorrect" }
    }

    // Update the password
    const hashedNewPassword = hashPassword(newPassword)
    const { error } = await supabase.from("admin_users").update({ password: hashedNewPassword }).eq("id", adminData.id)

    if (error) {
      console.error("Error updating password:", error)
      return { success: false, error: error.message }
    }

    return { success: true }
  } catch (error: any) {
    console.error("Unexpected error changing password:", error)
    return { success: false, error: error.message || "An unexpected error occurred" }
  }
}
