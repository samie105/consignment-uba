"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Button } from "@/components/ui/button"
import { useTheme } from "next-themes"
import { Sun, Moon, Check } from "lucide-react"
import { cn } from "@/lib/utils"
import { ChangePasswordForm } from "@/components/admin/change-password-form"

const colorOptions = [
  { value: "green", label: "Green", class: "bg-green-500" },
  { value: "blue", label: "Blue", class: "bg-blue-500" },
  { value: "red", label: "Red", class: "bg-red-500" },
  { value: "purple", label: "Purple", class: "bg-purple-500" },
  { value: "orange", label: "Orange", class: "bg-orange-500" },
  { value: "yellow", label: "Yellow", class: "bg-yellow-500" },
  { value: "pink", label: "Pink", class: "bg-pink-500" },
  { value: "teal", label: "Teal", class: "bg-teal-500" },
  { value: "indigo", label: "Indigo", class: "bg-indigo-500" },
  { value: "cyan", label: "Cyan", class: "bg-cyan-500" },
]

export default function SettingsPage() {
  const { theme, setTheme } = useTheme()
  const [colorPalette, setColorPalette] = useState("green")

  const handleColorChange = (value: string) => {
    setColorPalette(value)
    // Save to cookie or localStorage
    document.cookie = `color-palette=${value}; path=/; max-age=31536000`
    // Apply the color palette
    document.documentElement.style.setProperty("--color-primary", `var(--${value}-500)`)
    document.documentElement.style.setProperty("--color-primary-foreground", `var(--${value}-50)`)
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold tracking-tight">Settings</h1>

      <Tabs defaultValue="appearance">
        <TabsList>
          <TabsTrigger value="appearance">Appearance</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
        </TabsList>

        <TabsContent value="appearance" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Theme</CardTitle>
              <CardDescription>Choose between light and dark mode for the admin dashboard.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex space-x-2">
                <Button
                  variant={theme === "light" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setTheme("light")}
                  className="w-24"
                >
                  <Sun className="mr-2 h-4 w-4" />
                  Light
                </Button>
                <Button
                  variant={theme === "dark" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setTheme("dark")}
                  className="w-24"
                >
                  <Moon className="mr-2 h-4 w-4" />
                  Dark
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Color Palette</CardTitle>
              <CardDescription>Choose a color palette for the application.</CardDescription>
            </CardHeader>
            <CardContent>
              <RadioGroup
                value={colorPalette}
                onValueChange={handleColorChange}
                className="grid grid-cols-2 gap-4 sm:grid-cols-5"
              >
                {colorOptions.map((color) => (
                  <div key={color.value} className="flex items-center space-x-2">
                    <RadioGroupItem value={color.value} id={color.value} className="sr-only" />
                    <Label
                      htmlFor={color.value}
                      className={cn(
                        "flex h-10 w-full cursor-pointer items-center justify-center rounded-md border-2 border-muted bg-popover",
                        colorPalette === color.value && "border-primary",
                      )}
                    >
                      <span className={cn("h-6 w-6 rounded-full", color.class)} />
                      <span className="ml-2">{color.label}</span>
                      {colorPalette === color.value && <Check className="ml-1 h-4 w-4" />}
                    </Label>
                  </div>
                ))}
              </RadioGroup>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security" className="space-y-4">
          <ChangePasswordForm />
        </TabsContent>
      </Tabs>
    </div>
  )
}
