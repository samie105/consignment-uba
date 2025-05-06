"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import { getPackageById } from "@/server/actions/packageActions"
import { notFound, useParams } from "next/navigation"
import { EditPackageForm } from "@/components/admin/edit-package-form"
import { useEffect, useState } from "react"



export default function EditPackagePage() {
  const params = useParams()
  const id = params?.id as string
  const [packageData, setPackageData] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchPackage = async () => {
      const response = await getPackageById(id as string)
      if (!response.success || !response.package) {
        notFound()
      }
      setPackageData(response.package)
      setIsLoading(false)
    }

    fetchPackage()
  }, [id])

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="icon" disabled>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <h1 className="text-3xl font-bold tracking-tight">Loading...</h1>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-2">
        <Button variant="outline" size="icon" asChild>
          <Link href={`/admin/packages/${id}`}>
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <h1 className="text-3xl font-bold tracking-tight">Edit Package</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Package Information</CardTitle>
          <CardDescription>Update the package details, tracking information, and delivery status.</CardDescription>
        </CardHeader>
        <CardContent>
          <EditPackageForm packageData={packageData} />
        </CardContent>
      </Card>
    </div>
  )
}
