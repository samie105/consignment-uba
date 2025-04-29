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
    // Query the admin_users table
    const { data: user, error } = await supabase
      .from("admin_users")
      .select("id, email, name, role")
      .eq("email", email)
      .eq("password", password) // In a real app, you would compare hashed passwords
      .single()

    if (error || !user) {
      return {
        success: false,
        error: "Invalid email or password",
      }
    }

    // Set auth cookie
    const oneDay = 24 * 60 * 60 * 1000
    cookies().set("auth-token", user.id, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      expires: Date.now() + oneDay,
      path: "/",
    })

    return {
      success: true,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
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

    // Verify current password
    if (user.password !== currentPassword) {
      return {
        success: false,
        error: "Current password is incorrect",
      }
    }

    // Update password
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
