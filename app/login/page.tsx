import type { Metadata } from "next"
import LoginForm from "@/components/login-form"

export const metadata: Metadata = {
  title: "Login | DeliveryUno Admin",
  description: "Login to DeliveryUno admin dashboard",
}

export default function LoginPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background p-4">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold">DeliveryUno</h1>
          <p className="text-muted-foreground mt-2">Login to access the admin dashboard</p>
        </div>
        <LoginForm />
      </div>
    </div>
  )
}
