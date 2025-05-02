"use server"

import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import { supabase } from "@/lib/supabase"
import { createHash } from "crypto"

// Simple password hashing function
// In a production app, you would use a more secure method like bcrypt
function hashPassword(password: string): string {
  return createHash("sha256").update(password).digest("hex")
}

// Update the login function to focus on database authentication
export async function login(formData: FormData) {
  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 800))

  const email = formData.get("email") as string
  const password = formData.get("password") as string

  // Validate input
  if (!email || !password) {
    return {
      success: false,
      error: "Email and password are required",
    }
  }

  try {
    console.log("Attempting login for:", email)

    // First, check if the user exists and get their password
    const { data: userData, error: userError } = await supabase
      .from("admin_users")
      .select("id, email, name, role, password")
      .eq("email", email)
      .single()

    if (userError) {
      console.log("Database error:", userError.message)
      return {
        success: false,
        error: "Error retrieving user data",
      }
    }

    if (!userData) {
      console.log("User not found:", email)
      return {
        success: false,
        error: "Invalid email or password",
      }
    }

    console.log("User found:", userData.email)

    // Try direct password match first (for plain text passwords)
    let passwordMatches = userData.password === password

    // If that fails, try hashed password
    if (!passwordMatches) {
      const hashedPassword = hashPassword(password)
      passwordMatches = userData.password === hashedPassword
      console.log("Checking hashed password")
    }

    if (!passwordMatches) {
      console.log("Password mismatch for user:", email)
      return {
        success: false,
        error: "Invalid email or password",
      }
    }

    console.log("Password matched, login successful")

    // Set auth cookie
    const oneDay = 24 * 60 * 60 * 1000
    cookies().set("auth-token", userData.id, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      expires: Date.now() + oneDay,
      path: "/",
    })

    return {
      success: true,
      user: {
        id: userData.id,
        email: userData.email,
        name: userData.name,
        role: userData.role,
      },
    }
  } catch (error) {
    console.error("Login error:", error)
    return {
      success: false,
      error: "An error occurred during login",
    }
  }
}

// Add a function to list users (for debugging purposes)
export async function listUsers() {
  try {
    const { data: users, error } = await supabase.from("admin_users").select("id, email, name, role")

    if (error) {
      console.error("Error listing users:", error)
      return { success: false, error: error.message }
    }

    return {
      success: true,
      users: users.map((user) => ({
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
      })),
    }
  } catch (error) {
    console.error("Error listing users:", error)
    return { success: false, error: "An error occurred while listing users" }
  }
}

export async function logout() {
  cookies().delete("auth-token")
  redirect("/login")
}

export async function getSession() {
  const authToken = cookies().get("auth-token")?.value

  if (!authToken) {
    return null
  }

  try {
    // Query the admin_users table
    const { data: user, error } = await supabase
      .from("admin_users")
      .select("id, email, name, role")
      .eq("id", authToken)
      .single()

    if (error || !user) {
      return null
    }

    return {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
    }
  } catch (error) {
    console.error("Session error:", error)
    return null
  }
}

export async function changePassword(currentPassword: string, newPassword: string) {
  try {
    const authToken = cookies().get("auth-token")?.value

    if (!authToken) {
      return {
        success: false,
        error: "Not authenticated",
      }
    }

    // Get the user
    const { data: user, error: userError } = await supabase
      .from("admin_users")
      .select("id, password")
      .eq("id", authToken)
      .single()

    if (userError || !user) {
      return {
        success: false,
        error: "User not found",
      }
    }

    // Try both hashed and plain text password
    if (hashPassword(currentPassword) !== user.password && currentPassword !== user.password) {
      return {
        success: false,
        error: "Current password is incorrect",
      }
    }

    // Update password - store as plain text for now for simplicity
    const { error: updateError } = await supabase
      .from("admin_users")
      .update({
        password: newPassword,
        updated_at: new Date().toISOString(),
      })
      .eq("id", authToken)

    if (updateError) {
      return {
        success: false,
        error: "Failed to update password",
      }
    }

    return {
      success: true,
      message: "Password updated successfully",
    }
  } catch (error) {
    console.error("Change password error:", error)
    return {
      success: false,
      error: "An error occurred while changing password",
    }
  }
}
