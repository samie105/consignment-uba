"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Trash } from "lucide-react"
import { toast } from "sonner"
import { useRouter } from "next/navigation"
import { deletePackage } from "@/server/actions/packageActions"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

interface DeletePackageButtonProps {
  tracking_number: string
}

export default function DeletePackageButton({ tracking_number }: DeletePackageButtonProps) {
  const router = useRouter()
  const [isDeleting, setIsDeleting] = useState(false)
  const [showConfirmDialog, setShowConfirmDialog] = useState(false)

  const handleDeletePackage = async () => {
    setIsDeleting(true)
    try {
      const result = await deletePackage(tracking_number)
      if (result.success) {
        toast.success("Package deleted successfully")
        router.push("/admin/packages")
        router.refresh()
      } else {
        toast.error("Failed to delete package", {
          description: result.error || "An error occurred while deleting the package",
        })
      }
    } catch (error) {
      console.error("Error deleting package:", error)
      toast.error("Failed to delete package", {
        description: "An unexpected error occurred",
      })
    } finally {
      setIsDeleting(false)
      setShowConfirmDialog(false)
    }
  }

  return (
    <>
      <Button variant="destructive" onClick={() => setShowConfirmDialog(true)} disabled={isDeleting}>
        <Trash className="h-4 w-4 mr-2" />
        {isDeleting ? "Deleting..." : "Delete"}
      </Button>

      <AlertDialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the package with tracking number{" "}
              <span className="font-semibold">{tracking_number}</span> and all associated data.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeletePackage} className="bg-destructive text-destructive-foreground">
              {isDeleting ? "Deleting..." : "Delete Package"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
