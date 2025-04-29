"use client"

import type React from "react"

import { useEffect, useState } from "react"

// Simple XOR encryption/decryption function
function xorEncryptDecrypt(text: string, key: string): string {
  let result = ""
  for (let i = 0; i < text.length; i++) {
    result += String.fromCharCode(text.charCodeAt(i) ^ key.charCodeAt(i % key.length))
  }
  return result
}

// Base64 encoding/decoding for safe storage
function encodeBase64(text: string): string {
  if (typeof window !== "undefined") {
    return btoa(text)
  }
  return text
}

function decodeBase64(base64: string): string {
  if (typeof window !== "undefined") {
    try {
      return atob(base64)
    } catch (e) {
      console.error("Invalid base64 string:", e)
      return ""
    }
  }
  return base64
}

// Encrypt content for storing in environment variables
export function encryptForEnv(content: string, key: string): string {
  const encrypted = xorEncryptDecrypt(content, key)
  return encodeBase64(encrypted)
}

// Decrypt content from environment variables
export function decryptFromEnv(encryptedContent: string, key: string): string {
  try {
    const decoded = decodeBase64(encryptedContent)
    return xorEncryptDecrypt(decoded, key)
  } catch (error) {
    console.error("Error decrypting content:", error)
    return "Error decrypting content"
  }
}

// Component to decrypt and display protected content
export function ProtectedContent({
  encryptedContent,
  encryptionKey = "deliveryuno",
  fallback = "Loading...",
  as: Component = "div",
  className = "",
  ...props
}: {
  encryptedContent: string
  encryptionKey?: string
  fallback?: React.ReactNode
  as?: React.ElementType
  className?: string
  [key: string]: any
}) {
  const [content, setContent] = useState<string>("")
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    try {
      // Decrypt content only on client side
      const decrypted = decryptFromEnv(encryptedContent, encryptionKey)
      setContent(decrypted)
      setIsLoaded(true)
    } catch (error) {
      console.error("Error decrypting content:", error)
      setContent("Error loading content")
      setIsLoaded(true)
    }
  }, [encryptedContent, encryptionKey])

  if (!isLoaded) {
    return <>{fallback}</>
  }

  return <Component className={className} {...props} dangerouslySetInnerHTML={{ __html: content }} />
}

// Hook to use protected content
export function useProtectedContent(encryptedContent: string, encryptionKey = "deliveryuno") {
  const [content, setContent] = useState<string>("")
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    try {
      // Decrypt content only on client side
      const decrypted = decryptFromEnv(encryptedContent, encryptionKey)
      setContent(decrypted)
      setIsLoading(false)
    } catch (err) {
      setError(err instanceof Error ? err : new Error("Unknown error"))
      setIsLoading(false)
    }
  }, [encryptedContent, encryptionKey])

  return { content, isLoading, error }
}

// Section management
export interface ContentSection {
  id: string
  name: string
  content: string
  envVarName: string
}

// Local storage helpers for admin
export function saveContentSections(sections: ContentSection[]) {
  if (typeof window !== "undefined") {
    localStorage.setItem("deliveryuno_content_sections", JSON.stringify(sections))
  }
}

export function getContentSections(): ContentSection[] {
  if (typeof window !== "undefined") {
    const stored = localStorage.getItem("deliveryuno_content_sections")
    if (stored) {
      try {
        return JSON.parse(stored)
      } catch (e) {
        console.error("Error parsing stored content sections:", e)
      }
    }
  }
  return []
}
