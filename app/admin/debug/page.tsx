"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { createClient } from "@/lib/supabase"

export default function DebugPage() {
  const [users, setUsers] = useState<any[]>([])
  const [packages, setPackages] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [supabaseInfo, setSupabaseInfo] = useState<any>(null)

  const loadUsers = async () => {
    setLoading(true)
    setError(null)
    try {
      const supabase = createClient()
      const { data, error } = await supabase.from("admin_users").select("*")

      if (error) {
        throw error
      }

      setUsers(data || [])
    } catch (err: any) {
      console.error("Error loading users:", err)
      setError(err.message || "Failed to load users")
    } finally {
      setLoading(false)
    }
  }

  const loadPackages = async () => {
    setLoading(true)
    setError(null)
    try {
      const supabase = createClient()
      const { data, error } = await supabase.from("packages").select("*")

      if (error) {
        throw error
      }

      setPackages(data || [])
    } catch (err: any) {
      console.error("Error loading packages:", err)
      setError(err.message || "Failed to load packages")
    } finally {
      setLoading(false)
    }
  }

  const checkSupabaseConnection = async () => {
    setLoading(true)
    setError(null)
    try {
      const url = process.env.NEXT_PUBLIC_SUPABASE_URL
      const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

      setSupabaseInfo({
        url: url ? "Set (hidden for security)" : "Not set",
        key: key ? "Set (hidden for security)" : "Not set",
        hasCredentials: !!(url && key),
      })

      if (!url || !key) {
        throw new Error("Supabase credentials are missing")
      }

      const supabase = createClient()

      // Try a simple query to check connection
      const { data, error } = await supabase.from("admin_users").select("count")

      if (error) {
        throw error
      }

      setSupabaseInfo((prev) => ({
        ...prev,
        connected: true,
        message: "Successfully connected to Supabase!",
      }))
    } catch (err: any) {
      console.error("Error checking Supabase connection:", err)
      setError(err.message || "Failed to check Supabase connection")
      setSupabaseInfo((prev) => ({
        ...prev,
        connected: false,
        error: err.message,
      }))
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6 p-6">
      <h1 className="text-3xl font-bold tracking-tight">Debug Page</h1>

      <Card>
        <CardHeader>
          <CardTitle>Supabase Connection</CardTitle>
          <CardDescription>Check if Supabase is properly configured</CardDescription>
        </CardHeader>
        <CardContent>
          <Button onClick={checkSupabaseConnection} disabled={loading}>
            {loading ? "Checking..." : "Check Connection"}
          </Button>

          {supabaseInfo && (
            <div className="mt-4 p-4 bg-muted rounded-md">
              <h3 className="font-semibold mb-2">Supabase Configuration:</h3>
              <ul className="space-y-1">
                <li>URL: {supabaseInfo.url}</li>
                <li>API Key: {supabaseInfo.key}</li>
                <li>Has Credentials: {supabaseInfo.hasCredentials ? "Yes" : "No"}</li>
                {supabaseInfo.connected !== undefined && (
                  <li>
                    Connection:{" "}
                    {supabaseInfo.connected ? (
                      <span className="text-green-600">Connected</span>
                    ) : (
                      <span className="text-red-600">Failed</span>
                    )}
                  </li>
                )}
                {supabaseInfo.message && <li className="text-green-600">{supabaseInfo.message}</li>}
                {supabaseInfo.error && <li className="text-red-600">Error: {supabaseInfo.error}</li>}
              </ul>
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Admin Users</CardTitle>
          <CardDescription>View all admin users in the database</CardDescription>
        </CardHeader>
        <CardContent>
          <Button onClick={loadUsers} disabled={loading}>
            {loading ? "Loading..." : "Load Users"}
          </Button>

          {error && <p className="text-red-500 mt-4">{error}</p>}

          {users.length > 0 && (
            <div className="mt-4 overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-muted">
                    <th className="p-2 text-left">ID</th>
                    <th className="p-2 text-left">Email</th>
                    <th className="p-2 text-left">Name</th>
                    <th className="p-2 text-left">Role</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user) => (
                    <tr key={user.id} className="border-t">
                      <td className="p-2">{user.id}</td>
                      <td className="p-2">{user.email}</td>
                      <td className="p-2">{user.full_name}</td>
                      <td className="p-2">{user.role}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {users.length === 0 && !loading && !error && (
            <p className="mt-4 text-muted-foreground">No users found. Click "Load Users" to fetch data.</p>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Packages</CardTitle>
          <CardDescription>View all packages in the database</CardDescription>
        </CardHeader>
        <CardContent>
          <Button onClick={loadPackages} disabled={loading}>
            {loading ? "Loading..." : "Load Packages"}
          </Button>

          {error && <p className="text-red-500 mt-4">{error}</p>}

          {packages.length > 0 && (
            <div className="mt-4 overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-muted">
                    <th className="p-2 text-left">Tracking #</th>
                    <th className="p-2 text-left">Status</th>
                    <th className="p-2 text-left">Description</th>
                    <th className="p-2 text-left">Admin ID</th>
                  </tr>
                </thead>
                <tbody>
                  {packages.map((pkg) => (
                    <tr key={pkg.id} className="border-t">
                      <td className="p-2">{pkg.tracking_number}</td>
                      <td className="p-2">{pkg.status}</td>
                      <td className="p-2">{pkg.description}</td>
                      <td className="p-2">{pkg.admin_id || "N/A"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {packages.length === 0 && !loading && !error && (
            <p className="mt-4 text-muted-foreground">No packages found. Click "Load Packages" to fetch data.</p>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
