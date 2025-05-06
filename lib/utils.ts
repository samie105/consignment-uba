// Ensure this exists in your utils file to be used by the Carousel component
import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const isValidImageUrl = (url: string | null | undefined): boolean => {
  if (!url) return false
  return typeof url === "string" && url.trim().length > 0
}
