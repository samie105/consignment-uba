export const dynamic = "force-dynamic"

import Link from "next/link"
import { getPackageById } from "@/server/actions/packageActions"
import { Button } from "@/components/ui/button"
import { notFound } from "next/navigation"

export default async function PackageDetailPage({ params }: { params: { id: string } }) {
  const { package: pkg, success, error } = await getPackageById(params.id)

  if (error || !pkg) {
    return notFound()
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Package Details</h1>
        <div className="flex space-x-2">
          <Link href={`/admin/packages/${params.id}/edit`}>
            <Button variant="outline">Edit</Button>
          </Link>
          <Link href={`/admin/packages/${params.id}/print`}>
            <Button>Print</Button>
          </Link>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h2 className="text-lg font-semibold mb-4">Package Information</h2>
            <div className="space-y-2">
              <p>
                <span className="font-medium">Tracking Number:</span> {pkg.tracking_number}
              </p>
              <p>
                <span className="font-medium">Status:</span> {pkg.status}
              </p>
              <p>
                <span className="font-medium">Description:</span> {pkg.description || "N/A"}
              </p>
              <p>
                <span className="font-medium">Weight:</span> {pkg.weight ? `${pkg.weight} kg` : "N/A"}
              </p>
              <p>
                <span className="font-medium">Dimensions:</span>{" "}
                {pkg.dimensions
                  ? `${pkg.dimensions.length}x${pkg.dimensions.width}x${pkg.dimensions.height} cm`
                  : "N/A"}
              </p>
              <p>
                <span className="font-medium">Created:</span> {new Date(pkg.created_at).toLocaleString()}
              </p>
            </div>
          </div>

          <div>
            <h2 className="text-lg font-semibold mb-4">Sender & Recipient</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h3 className="font-medium">Sender</h3>
                <p>{pkg.sender?.name || "N/A"}</p>
                <p>{pkg.sender?.address || "N/A"}</p>
                <p>{pkg.sender?.phone || "N/A"}</p>
                <p>{pkg.sender?.email || "N/A"}</p>
              </div>

              <div>
                <h3 className="font-medium">Recipient</h3>
                <p>{pkg.recipient?.name || "N/A"}</p>
                <p>{pkg.recipient?.address || "N/A"}</p>
                <p>{pkg.recipient?.phone || "N/A"}</p>
                <p>{pkg.recipient?.email || "N/A"}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8">
          <h2 className="text-lg font-semibold mb-4">Tracking History</h2>
          <div className="space-y-4">
            {pkg.checkpoints && pkg.checkpoints.length > 0 ? (
              pkg.checkpoints.map((checkpoint: any) => (
                <div key={checkpoint.id} className="border-l-2 border-blue-500 pl-4 pb-4">
                  <p className="text-sm text-gray-500">{new Date(checkpoint.timestamp).toLocaleString()}</p>
                  <p className="font-medium">{checkpoint.status}</p>
                  <p>{checkpoint.location}</p>
                  <p className="text-sm">{checkpoint.description}</p>
                </div>
              ))
            ) : (
              <p className="text-gray-500">No tracking history available</p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
