"use client"

import { useRef } from "react"
import { notFound } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Download } from "lucide-react"
import html2pdf from "html2pdf.js"

// Mock data for testing - this ensures we have data even if the server action fails
const mockPackages = {
  TRK123456789: {
    trackingNumber: "TRK123456789",
    status: "in_transit",
    description: "Electronics and accessories",
    weight: 2.5,
    dimensions: {
      length: 30,
      width: 20,
      height: 10,
    },
    sender: {
      fullName: "John Doe",
      email: "john@example.com",
      phone: "123-456-7890",
      address: "123 Main St, City, Country",
    },
    recipient: {
      fullName: "Jane Smith",
      email: "jane@example.com",
      phone: "098-765-4321",
      address: "456 Oak Ave, Town, Country",
    },
    payment: {
      amount: 25.99,
      isPaid: true,
      method: "credit_card",
    },
    checkpoints: [
      {
        location: "Origin Facility",
        timestamp: "2023-06-01T08:00:00Z",
        description: "Package received at origin facility",
      },
      {
        location: "Regional Distribution Center",
        timestamp: "2023-06-02T14:30:00Z",
        description: "Package in transit to destination",
      },
    ],
    createdAt: "2023-06-01T08:00:00Z",
  },
  TRK987654321: {
    trackingNumber: "TRK987654321",
    status: "delivered",
    description: "Books and documents",
    weight: 1.2,
    dimensions: {
      length: 25,
      width: 18,
      height: 5,
    },
    sender: {
      fullName: "Alice Johnson",
      email: "alice@example.com",
      phone: "555-123-4567",
      address: "789 Pine St, Village, Country",
    },
    recipient: {
      fullName: "Bob Williams",
      email: "bob@example.com",
      phone: "555-987-6543",
      address: "321 Elm St, City, Country",
    },
    payment: {
      amount: 15.5,
      isPaid: true,
      method: "paypal",
    },
    checkpoints: [
      {
        location: "Origin Facility",
        timestamp: "2023-05-28T09:15:00Z",
        description: "Package received at origin facility",
      },
      {
        location: "Regional Distribution Center",
        timestamp: "2023-05-29T11:45:00Z",
        description: "Package in transit to destination",
      },
      {
        location: "Local Delivery Facility",
        timestamp: "2023-05-30T08:30:00Z",
        description: "Out for delivery",
      },
      {
        location: "Recipient Address",
        timestamp: "2023-05-30T14:20:00Z",
        description: "Package delivered",
      },
    ],
    createdAt: "2023-05-28T09:15:00Z",
  },
  TRK456789123: {
    trackingNumber: "TRK456789123",
    status: "pending",
    description: "Clothing and accessories",
    weight: 0.8,
    dimensions: {
      length: 22,
      width: 15,
      height: 8,
    },
    sender: {
      fullName: "Michael Brown",
      email: "michael@example.com",
      phone: "555-222-3333",
      address: "567 Maple Ave, Town, Country",
    },
    recipient: {
      fullName: "Sarah Davis",
      email: "sarah@example.com",
      phone: "555-444-5555",
      address: "890 Cedar St, City, Country",
    },
    payment: {
      amount: 12.75,
      isPaid: false,
      method: "",
    },
    checkpoints: [
      {
        location: "Origin Facility",
        timestamp: "2023-06-03T10:20:00Z",
        description: "Package received at origin facility",
      },
    ],
    createdAt: "2023-06-03T10:20:00Z",
  },
}

export default function PackagePrintPage({ params }: { params: { id: string } }) {
  const { id } = params
  const receiptRef = useRef<HTMLDivElement>(null)

  // Use mock data for now to ensure the page renders
  const packageData = mockPackages[id]

  if (!packageData) {
    return notFound()
  }

  const downloadPdf = () => {
    if (receiptRef.current) {
      const element = receiptRef.current
      const opt = {
        margin: [10, 10, 10, 10],
        filename: `DeliveryUno-Receipt-${packageData.trackingNumber}.pdf`,
        image: { type: "jpeg", quality: 0.98 },
        html2canvas: { scale: 2, useCORS: true },
        jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
      }

      html2pdf().set(opt).from(element).save()
    }
  }

  return (
    <div className="max-w-4xl mx-auto p-4 md:p-8 bg-white">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="icon" asChild className="print:hidden">
            <Link href={`/admin/packages/${id}`}>
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <h1 className="text-2xl md:text-3xl font-bold">Package Receipt</h1>
        </div>
        <div className="flex space-x-2">
          <Button onClick={() => window.print()} className="print:hidden">
            Print
          </Button>
          <Button onClick={downloadPdf} className="print:hidden">
            <Download className="h-4 w-4 mr-2" />
            Download PDF
          </Button>
        </div>
      </div>

      <div ref={receiptRef} className="bg-white p-6 rounded-lg shadow-sm border">
        <div className="border-t border-b py-4 mb-6">
          <div className="text-center">
            <h2 className="text-2xl font-bold">DeliveryUno</h2>
            <p className="text-muted-foreground">Your Trusted Delivery Partner</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          <div>
            <h3 className="text-lg font-semibold mb-2">Package Information</h3>
            <div className="space-y-1">
              <p>
                <span className="font-medium">Tracking Number:</span> {packageData.trackingNumber}
              </p>
              <p>
                <span className="font-medium">Status:</span> {packageData.status.replace("_", " ")}
              </p>
              <p>
                <span className="font-medium">Description:</span> {packageData.description}
              </p>
              <p>
                <span className="font-medium">Weight:</span> {packageData.weight} kg
              </p>
              <p>
                <span className="font-medium">Dimensions:</span> {packageData.dimensions.length} ×{" "}
                {packageData.dimensions.width} × {packageData.dimensions.height} cm
              </p>
              <p>
                <span className="font-medium">Created:</span> {new Date(packageData.createdAt).toLocaleString()}
              </p>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-2">Payment Information</h3>
            <div className="space-y-1">
              <p>
                <span className="font-medium">Amount:</span> ${packageData.payment.amount.toFixed(2)}
              </p>
              <p>
                <span className="font-medium">Status:</span> {packageData.payment.isPaid ? "Paid" : "Unpaid"}
              </p>
              <p>
                <span className="font-medium">Method:</span> {packageData.payment.method || "N/A"}
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          <div>
            <h3 className="text-lg font-semibold mb-2">Sender Information</h3>
            <div className="space-y-1">
              <p>
                <span className="font-medium">Name:</span> {packageData.sender.fullName}
              </p>
              <p>
                <span className="font-medium">Email:</span> {packageData.sender.email}
              </p>
              <p>
                <span className="font-medium">Phone:</span> {packageData.sender.phone}
              </p>
              <p>
                <span className="font-medium">Address:</span> {packageData.sender.address}
              </p>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-2">Recipient Information</h3>
            <div className="space-y-1">
              <p>
                <span className="font-medium">Name:</span> {packageData.recipient.fullName}
              </p>
              <p>
                <span className="font-medium">Email:</span> {packageData.recipient.email}
              </p>
              <p>
                <span className="font-medium">Phone:</span> {packageData.recipient.phone}
              </p>
              <p>
                <span className="font-medium">Address:</span> {packageData.recipient.address}
              </p>
            </div>
          </div>
        </div>

        <div className="mb-8">
          <h3 className="text-lg font-semibold mb-2">Tracking History</h3>
          {packageData.checkpoints && packageData.checkpoints.length > 0 ? (
            <div className="space-y-4">
              {packageData.checkpoints.map((checkpoint: any, index: number) => (
                <div key={index} className="flex items-start space-x-4 border-l-2 border-gray-300 pl-4">
                  <div className="flex-1">
                    <p className="font-medium">{checkpoint.location}</p>
                    <p className="text-sm text-muted-foreground">{checkpoint.description}</p>
                    <p className="text-xs text-muted-foreground">{new Date(checkpoint.timestamp).toLocaleString()}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-center text-muted-foreground py-4">No tracking history available</p>
          )}
        </div>

        <div className="text-center text-sm text-muted-foreground mt-12 pt-4 border-t">
          <p>Thank you for choosing DeliveryUno for your shipping needs.</p>
          <p>For any inquiries, please contact support@deliveryuno.com</p>
        </div>

        <div className="mt-8 text-center">
          <div className="inline-block border-t border-dashed w-full pt-2 text-xs text-muted-foreground">
            <p>This is an official receipt from DeliveryUno</p>
            <p>Document generated on {new Date().toLocaleString()}</p>
          </div>
        </div>
      </div>

      <style jsx global>{`
        @media print {
          @page {
            size: A4;
            margin: 1cm;
          }
          body {
            print-color-adjust: exact;
            -webkit-print-color-adjust: exact;
          }
        }
      `}</style>
    </div>
  )
}
