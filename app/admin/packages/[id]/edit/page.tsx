export const dynamic = "force-dynamic"

import { getPackageById } from "@/server/actions/packageActions"
import { notFound } from "next/navigation"

export default async function EditPackagePage({ params }: { params: { id: string } }) {
  const { package: pkg, success, error } = await getPackageById(params.id)

  if (error || !pkg) {
    return notFound()
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Edit Package</h1>

      {/* Package edit form will be added here */}
      <div className="bg-white rounded-lg shadow p-6">
        <p>Edit form for package: {pkg.tracking_number}</p>
        {/* We'll implement the actual form in a separate component */}
      </div>
    </div>
  )
}
