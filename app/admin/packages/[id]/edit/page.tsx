import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import { getPackageById } from "@/server/actions/packageActions"
import { notFound } from "next/navigation"
import { EditPackageForm } from "@/components/admin/edit-package-form"

interface EditPackagePageProps {
  params: {
    id: string
  }
}

export default async function EditPackagePage({ params }: EditPackagePageProps) {
  const { id } = params
  const response = await getPackageById(id)

  if (!response.success || !response.package) {
    notFound()
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
          <EditPackageForm packageData={response.package} />
        </CardContent>
      </Card>
    </div>
  )
}
