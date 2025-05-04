"use client"

import { notFound } from "next/navigation"
import { getPackageById } from "@/server/actions/packageActions"
import Printclient from "@/components/printclient";

export default async function PrintPackagePage({ params }: { params: { id: string } }) {
  const { success, package: packageData, error } = await getPackageById(params.id);


  if (!success || !packageData) {
    notFound()
  }

 

  return (
    <div className="container mx-auto p-8">
      <div className="max-w-4xl mx-auto bg-white p-8 rounded-lg shadow">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold mb-2">Package Receipt</h1>
          <p className="text-gray-600">Tracking Number: {packageData.tracking_number}</p>
        </div>

        <div className="grid grid-cols-2 gap-8 mb-8">
          <div>
            <h2 className="text-lg font-semibold mb-4">Sender Information</h2>
            <div className="space-y-2">
              <p><strong>Name:</strong> {packageData.sender.fullName}</p>
              <p><strong>Email:</strong> {packageData.sender.email}</p>
              <p><strong>Phone:</strong> {packageData.sender.phone}</p>
              <p><strong>Address:</strong> {packageData.sender.address}</p>
            </div>
          </div>

          <div>
            <h2 className="text-lg font-semibold mb-4">Recipient Information</h2>
            <div className="space-y-2">
              <p><strong>Name:</strong> {packageData.recipient.fullName}</p>
              <p><strong>Email:</strong> {packageData.recipient.email}</p>
              <p><strong>Phone:</strong> {packageData.recipient.phone}</p>
              <p><strong>Address:</strong> {packageData.recipient.address}</p>
            </div>
          </div>
        </div>

        <div className="mb-8">
          <h2 className="text-lg font-semibold mb-4">Package Details</h2>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p><strong>Status:</strong> {packageData.status.replace("_", " ")}</p>
              <p><strong>Description:</strong> {packageData.description}</p>
              <p><strong>Weight:</strong> {packageData.weight} kg</p>
            </div>
            <div>
              <p><strong>Dimensions:</strong> {packageData.dimensions.length} x {packageData.dimensions.width} x {packageData.dimensions.height} cm</p>
              <p><strong>Created:</strong> {new Date(packageData.created_at).toLocaleDateString()}</p>
            </div>
          </div>
        </div>

        <div className="mb-8">
          <h2 className="text-lg font-semibold mb-4">Payment Information</h2>
          <div className="space-y-2">
            <p><strong>Amount:</strong> ${packageData.payment.amount}</p>
            <p><strong>Status:</strong> {packageData.payment.isPaid ? "Paid" : "Pending"}</p>
            <p><strong>Method:</strong> {packageData.payment.method}</p>
          </div>
        </div>

        <div>
          <h2 className="text-lg font-semibold mb-4">Tracking History</h2>
          <div className="space-y-4">
            {packageData.checkpoints.map((checkpoint: any, index: number) => (
              <div key={index} className="border-l-2 border-gray-300 pl-4">
                <p className="font-medium">{checkpoint.location}</p>
                <p className="text-sm text-gray-600">{new Date(checkpoint.timestamp).toLocaleString()}</p>
                <p className="text-sm">{checkpoint.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

    <Printclient packageData={packageData} params={params} />
    </div>
  )
}
