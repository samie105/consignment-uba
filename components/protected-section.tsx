"use client"

import { ProtectedContent } from "@/lib/content-protection"

export default function ProtectedSection() {
  // This would come from your environment variables
  const encryptedContent = process.env.NEXT_PUBLIC_PROTECTED_CONTENT || ""

  return (
    <section className="py-16">
      <div className="container px-4 md:px-6">
        <ProtectedContent encryptedContent={encryptedContent} className="prose dark:prose-invert max-w-none" />
      </div>
    </section>
  )
}
