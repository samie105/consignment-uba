"use client"

import { useState } from "react"
import { listUsers } from "@/server/actions/authActions"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

export default function DebugPage() {
  const [users, setUsers] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function fetchUsers() {
    setLoading(true)
    setError(null)
    try {
      const result = await listUsers()
      if (result.success) {
        setUsers(result.users)
      } else {
        setError(result.error || "Failed to fetch users")
      }
    } catch (err) {
      setError("An unexpected error occurred")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container mx-auto py-10">
      <Card>
        <CardHeader>
          <CardTitle>Debug: Database Users</CardTitle>
          <CardDescription>This page shows the users in your database (without passwords)</CardDescription>
        </CardHeader>
        <CardContent>
          <Button onClick={fetchUsers} disabled={loading} className="mb-4">
            {loading ? "Loading..." : "Load Users"}
          </Button>

          {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">{error}</div>}

          {users.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="min-w-full bg-white border border-gray-200">
                <thead>
                  <tr>
                    <th className="px-4 py-2 border">ID</th>
                    <th className="px-4 py-2 border">Email</th>
                    <th className="px-4 py-2 border">Name</th>
                    <th className="px-4 py-2 border">Role</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user) => (
                    <tr key={user.id}>
                      <td className="px-4 py-2 border">{user.id}</td>
                      <td className="px-4 py-2 border">{user.email}</td>
                      <td className="px-4 py-2 border">{user.name}</td>
                      <td className="px-4 py-2 border">{user.role}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p>No users loaded. Click the button above to load users.</p>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
