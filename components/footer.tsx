"use client"

import type React from "react"
import { scrollToSection } from "@/lib/scroll-utils"

export default function Footer() {
  // Handle footer link clicks for smooth scrolling
  const handleFooterLinkClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    // Only handle hash links
    if (href.startsWith("#")) {
      const sectionId = href.substring(1)
      scrollToSection(e, sectionId)
    }
  }

  return null
}
