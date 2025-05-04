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
  try {
    const email = formData.get("email") as string
    const password = formData.get("password") as string

    if (!email || !password) {
      return { success: false, error: "Email and password are required" }
    }

    console.log(`Attempting login for email: ${email}`)

    const supabase = createClient()

    // First, check if the user exists
    const { data: userData, error: userError } = await supabase
      .from("admin_users")
      .select("*")
      .eq("email", email)
      .single()

    if (userError) {
      console.error("Error fetching user:", userError)
      return { success: false, error: "Invalid email or password" }
    }

    if (!userData) {
      console.log("User not found")
      return { success: false, error: "Invalid email or password" }
    }

    console.log("User found, checking password")

    // Check if the password matches (try both hashed and plain)
    const hashedPassword = hashPassword(password)
    const passwordMatches = userData.password === hashedPassword || userData.password === password

    if (!passwordMatches) {
      console.log("Password doesn't match")
      console.log(`Provided hash: ${hashedPassword}`)
      console.log(`Stored password: ${userData.password}`)
      return { success: false, error: "Invalid email or password" }
    }

    // Set a cookie with the user data
    const cookieStore = cookies()
    cookieStore.set(
      "admin",
      JSON.stringify({
        id: userData.id,
        email: userData.email,
        role: userData.role,
        name: userData.full_name,
      }),
      {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
        maxAge: 60 * 60 * 24 * 7, // 1 week
      },
    )

    console.log("Login successful")
    return { success: true }
  } catch (error: any) {
    console.error("Unexpected error during login:", error)
    return { success: false, error: error.message || "An unexpected error occurred" }
  }
}

// Logout function
export async function logout() {
  const cookieStore = cookies()
  cookieStore.delete("admin")
  redirect("/login")
}

// Check if the user is logged in
export async function getSession() {
  const cookieStore = cookies()
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
    const cookieStore = cookies()
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
