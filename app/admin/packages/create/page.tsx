import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import { CreatePackageForm } from "@/components/admin/create-package-form"

export default function CreatePackagePage() {
  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center space-x-2">
        <Button variant="outline" size="icon" asChild>
          <Link href="/admin/packages">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <h1 className="text-3xl font-bold tracking-tight">Create Package</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Package Information</CardTitle>
          <CardDescription>Enter the package details, sender and recipient information.</CardDescription>
        </CardHeader>
        <CardContent>
          <CreatePackageForm />
        </CardContent>
      </Card>
    </div>
  )
}
