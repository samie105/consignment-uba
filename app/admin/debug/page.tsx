export const dynamic = "force-dynamic"

import { createClient } from "@/lib/supabase"
import { Button } from "@/components/ui/button"

export default function DebugPage() {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Debug Page</h1>

      <div className="space-y-8">
        <section className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Environment Variables</h2>
          <div className="space-y-2">
            <p>
              <span className="font-medium">NEXT_PUBLIC_SUPABASE_URL: </span>
              {process.env.NEXT_PUBLIC_SUPABASE_URL ? "✅ Set" : "❌ Not set"}
            </p>
            <p>
              <span className="font-medium">NEXT_PUBLIC_SUPABASE_ANON_KEY: </span>
              {process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? "✅ Set" : "❌ Not set"}
            </p>
          </div>
        </section>

        <section className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Database Connection</h2>
          <form
            action={async () => {
              "use server"
              const supabase = createClient()
              return await supabase.from("admin_users").select("*")
            }}
          >
            <Button type="submit">Test Connection</Button>
          </form>
        </section>

        <section className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Admin Users</h2>
          <form
            action={async () => {
              "use server"
              const supabase = createClient()
              return await supabase.from("admin_users").select("*")
            }}
          >
            <Button type="submit">Load Users</Button>
          </form>
        </section>

        <section className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Packages</h2>
          <form
            action={async () => {
              "use server"
              const supabase = createClient()
              return await supabase.from("packages").select("*")
            }}
          >
            <Button type="submit">Load Packages</Button>
          </form>
        </section>

        <section className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Storage Buckets</h2>
          <form
            action={async () => {
              "use server"
              const supabase = createClient()
              return await supabase.storage.listBuckets()
            }}
          >
            <Button type="submit">List Buckets</Button>
          </form>
        </section>
      </div>
    </div>
  )
}
