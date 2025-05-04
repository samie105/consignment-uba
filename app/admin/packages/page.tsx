import { PackageTable } from "@/components/admin/package-table"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Plus } from "lucide-react"

export default async function PackagesPage() {
  // Mock data for testing
  const mockPackages = [
    {
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
    {
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
    {
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
  ]

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Packages</h1>
        <Button asChild>
          <Link href="/admin/packages/create">
            <Plus className="mr-2 h-4 w-4" />
            Add Package
          </Link>
        </Button>
      </div>

      <PackageTable packages={mockPackages} />
    </div>
  )
}
