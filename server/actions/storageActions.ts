"use server"

import { initStorage } from "@/lib/supabase-storage"

export async function initializeStorage() {
  try {
    await initStorage()
    return { success: true }
  } catch (error) {
    console.error("Failed to initialize storage:", error)
    // Don't fail the app startup, just log the error
    return { success: false, error }
  }
}
