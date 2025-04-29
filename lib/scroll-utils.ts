import type React from "react"
export const scrollToSection = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
  e.preventDefault()
  const element = document.getElementById(id)
  if (element) {
    window.scrollTo({
      top: element.offsetTop - 80, // Offset for header
      behavior: "smooth",
    })

    // Update URL without page reload
    window.history.pushState({}, "", `#${id}`)
  }
}
