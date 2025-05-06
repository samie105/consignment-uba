"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { EditPackageForm } from "@/components/admin/edit-package-form"
import { PageHeader } from "@/components/page-header"
import { getPackageById } from "@/server/actions/packageActions"
import { Button } from "@/components/ui/button"
import { Container } from "@/components/ui/container"
import { ArrowLeft, Loader2 } from "lucide-react"
import { toast } from "sonner"

export default function EditPackagePage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const [packageData, setPackageData] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchPackage = async () => {
      try {
        console.log("Fetching package with ID:", params.id)
        setLoading(true)
        const result = await getPackageById(params.id)
        
        if (result.success && result.package) {
          console.log("Package fetched successfully:", result.package)
          setPackageData(result.package)
          setError(null)
        } else {
          console.error("Error fetching package:", result.error)
          setError(result.error || "Failed to fetch package data")
          toast.error("Failed to fetch package data", {
            description: result.error,
          })
        }
      } catch (err: any) {
        console.error("Unexpected error:", err)
        setError(err.message || "An unexpected error occurred")
        toast.error("An unexpected error occurred", {
          description: err.message,
        })
      } finally {
        setLoading(false)
      }
    }

    fetchPackage()
  }, [params.id])

  const handleSuccess = () => {
    // Redirect back to packages list
    router.push("/admin/packages")
  }

  return (
    <Container>
      <div className="space-y-6">
        <PageHeader
          title="Edit Package"
          description="Update package information and tracking details"
        />

        <Button 
          variant="outline" 
          onClick={() => router.back()}
          className="mb-6"
        >
          <ArrowLeft className="mr-2 h-4 w-4" /> Back
        </Button>

        {loading ? (
          <div className="flex justify-center items-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : error ? (
          <div className="bg-destructive/10 text-destructive p-4 rounded-md">
            <p>Error: {error}</p>
            <Button 
              variant="outline" 
              onClick={() => router.back()}
              className="mt-4"
            >
              Go Back
            </Button>
          </div>
        ) : packageData ? (
          <EditPackageForm packageData={packageData} onSuccess={handleSuccess} />
        ) : (
          <div className="bg-muted p-4 rounded-md">
            <p>Package not found.</p>
          </div>
        )}
      </div>
    </Container>
  )
} 