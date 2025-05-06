"use client"

import { useState } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { MoreHorizontal, Pencil, Trash, Eye, Copy, FileDown } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { deletePackage } from "@/server/actions/packageActions"
import { Package } from "@/types/package"
import ExportPDFButton from "@/components/export-pdf-button"
import { PackageData } from "@/types"

interface PackageTableProps {
  packages: Package[]
  simplified?: boolean
}

// Helper function to adapt Package to PackageData for the PDF export
const adaptPackageForPDF = (pkg: Package): PackageData => {
  return {
    id: pkg.tracking_number,
    tracking_number: pkg.tracking_number,
    status: pkg.status,
    statusText: getStatusText(pkg.status),
    description: pkg.description,
    weight: pkg.weight.toString(),
    dimensions: pkg.dimensions,
    sender: {
      ...pkg.sender,
      name: pkg.sender.fullName
    },
    recipient: {
      ...pkg.recipient,
      name: pkg.recipient.fullName
    },
    payment: {
      ...pkg.payment,
      currency: 'USD',
      status: pkg.payment.isPaid ? 'Paid' : 'Unpaid'
    },
    current_location: pkg.current_location,
    images: pkg.images || [],
    pdfs: pkg.pdfs || [],
    checkpoints: pkg.checkpoints.map(cp => ({
      ...cp,
      coordinates: cp.coordinates ? {
        lat: cp.coordinates.latitude,
        lng: cp.coordinates.longitude
      } : undefined
    })),
    created_at: pkg.created_at,
    updated_at: pkg.updated_at,
    admin_id: pkg.admin_id,
    package_type: pkg.package_type || 'standard',
    date_shipped: pkg.date_shipped || new Date().toISOString(),
    ship_date: pkg.date_shipped || new Date().toISOString(),
    estimated_delivery_date: pkg.estimated_delivery_date || '',
    show_payment_section: pkg.payment.isVisible || false,
    payment_visibility: pkg.payment.isVisible || false
  }
}

// Helper function to format status text
const getStatusText = (status: string): string => {
  switch (status) {
    case "in_warehouse": return "In Warehouse";
    case "in_transit": return "In Transit";
    case "arrived": return "Arrived";
    case "customs_check": return "Customs Check";
    case "customs_hold": return "Customs Clearance (ON HOLD)";
    case "delivered": return "Delivered";
    case "pending": return "Pending";
    case "exception": return "Exception";
    default: return status.replace(/_/g, " ").replace(/\b\w/g, l => l.toUpperCase());
  }
};

export function PackageTable({ packages, simplified = false }: PackageTableProps) {
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [selectedPackage, setSelectedPackage] = useState<Package | null>(null)
  const router = useRouter()

  const handleDelete = (pkg: Package) => {
    setSelectedPackage(pkg)
    setIsDeleteDialogOpen(true)
  }

  const confirmDelete = async () => {
    if (!selectedPackage) return

    try {
      // Call the delete package server action
      const result = await deletePackage(selectedPackage.tracking_number)

      if (result.success) {
        toast.success("Package deleted", {
          description: `Package ${selectedPackage.tracking_number} has been deleted successfully.`,
        })
      } else {
        toast.error("Error", {
          description: result.error || "Failed to delete package. Please try again.",
        })
      }

      setIsDeleteDialogOpen(false)
      // Refresh the page to show updated data
      router.refresh()
    } catch (error) {
      console.error("Failed to delete package", error)
      toast.error("Error", {
        description: "Failed to delete package. Please try again.",
      })
    }
  }

  const handleCopyTrackingNumber = (trackingNumber: string) => {
    navigator.clipboard.writeText(trackingNumber)
      .then(() => {
        toast.success("Tracking number copied to clipboard")
      })
      .catch((error) => {
        console.error("Failed to copy tracking number", error)
        toast.error("Failed to copy tracking number")
      })
  }

  return (
    <>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Tracking #</TableHead>
              <TableHead>Sender</TableHead>
              <TableHead>Recipient</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {packages.length > 0 ? (
              packages.map((pkg) => (
                <TableRow key={pkg.tracking_number}>
                  <TableCell className="font-medium">
                    <div className="flex items-center gap-2">
                      <Link href={`/admin/packages/${pkg.tracking_number}`} className="hover:underline">
                        {pkg.tracking_number}
                      </Link>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-6 w-6" 
                        onClick={() => handleCopyTrackingNumber(pkg.tracking_number)}
                      >
                        <Copy className="h-3.5 w-3.5" />
                        <span className="sr-only">Copy tracking number</span>
                      </Button>
                    </div>
                  </TableCell>
                  <TableCell>{pkg.sender.fullName}</TableCell>
                  <TableCell>{pkg.recipient.fullName}</TableCell>
                  <TableCell>
                    <span
                      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                        pkg.status === "delivered"
                          ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
                          : pkg.status === "in_transit"
                            ? "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300"
                            : "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300"
                      }`}
                    >
                      {pkg.status.replace("_", " ")}
                    </span>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end items-center space-x-1">
                      <ExportPDFButton packageData={adaptPackageForPDF(pkg)} />
                      
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="h-4 w-4" />
                            <span className="sr-only">Open menu</span>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem asChild>
                            <Link href={`/admin/packages/${pkg.tracking_number}`}>
                              <Eye className="mr-2 h-4 w-4" />
                              View Details
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem asChild>
                            <Link href={`/admin/packages/${pkg.tracking_number}/edit`}>
                              <Pencil className="mr-2 h-4 w-4" />
                              Edit
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleCopyTrackingNumber(pkg.tracking_number)}>
                            <Copy className="mr-2 h-4 w-4" />
                            Copy Tracking #
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleDelete(pkg)} className="text-red-600 focus:text-red-600">
                            <Trash className="mr-2 h-4 w-4" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={5} className="h-24 text-center">
                  No packages found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete package {selectedPackage?.tracking_number}? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={confirmDelete}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
