import { PackageTable } from "@/components/admin/package-table"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Plus } from "lucide-react"
import { getAllPackages } from "@/server/actions/packageActions"

export default async function PackagesPage() {
  const { success, packages = [], error } = await getAllPackages()

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

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded relative" role="alert">
          <strong className="font-bold">Error: </strong>
          <span className="block sm:inline">{error}</span>
        </div>
      )}

      {success && packages.length > 0 ? (
        <PackageTable packages={packages} />
      ) : (
        <div className="text-center py-8">
          <p className="text-muted-foreground mb-4">No packages available</p>
          <Button asChild>
            <Link href="/admin/packages/create">
              <Plus className="mr-2 h-4 w-4" />
              Create Your First Package
            </Link>
          </Button>
        </div>
      )}
    </div>
  )
}
