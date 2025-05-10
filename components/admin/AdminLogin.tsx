"use client"

import type React from "react"

import { useState } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Lock } from "lucide-react"
import { verifyAdminPassword } from "@/app/actions/question-actions"

type AdminLoginProps = {
  onLogin: () => void
}

export function AdminLogin({ onLogin }: AdminLoginProps) {
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    try {
      const isValid = await verifyAdminPassword(password)

      if (isValid) {
        // Speichere den Authentifizierungsstatus in der Session
        sessionStorage.setItem("adminAuthenticated", "true")
        onLogin()
      } else {
        setError("Falsches Passwort. Bitte versuche es erneut.")
      }
    } catch (err) {
      setError("Ein Fehler ist aufgetreten. Bitte versuche es später erneut.")
      console.error(err)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex items-center justify-center min-h-[70vh]">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <Card>
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl text-center">Admin-Bereich</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <div className="relative">
                  <Input
                    id="password"
                    type="password"
                    placeholder="Passwort eingeben"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pr-10"
                  />
                  <Lock className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                </div>
                {error && <p className="text-sm text-red-500">{error}</p>}
              </div>
              <Button type="submit" className="w-full bg-rose-600 hover:bg-rose-700" disabled={isLoading}>
                {isLoading ? "Überprüfe..." : "Anmelden"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}
