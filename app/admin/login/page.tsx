"use client"

import { useState } from "react"
import { useAuth } from "@/context/AuthContext"
import { useRouter } from "next/navigation"
import Container from "@/components/Container"

export default function AdminLogin() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const { signIn } = useAuth()
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); setLoading(true); setError("")
    const { error: signInError } = await signIn(email, password)
    if (signInError) { setError(signInError); setLoading(false) }
    else router.push("/admin")
  }

  return (
    <main className="min-h-screen bg-[#F7F5F2] flex items-center justify-center py-12">
      <Container>
        <div className="max-w-md mx-auto">
          <h1 className="text-3xl font-semibold mb-2 text-center">DPiLOT <span className="text-[#1B3A4B]">COLLECTION</span></h1>
          <p className="text-center text-[#6B7280] mb-8">Admin Panel</p>
          <form onSubmit={handleSubmit} className="space-y-4 bg-white p-8 shadow-sm">
            {error && <div className="bg-red-50 text-red-500 p-3 text-sm">{error}</div>}
            <div><label className="block text-sm font-medium mb-1">Email</label><input type="email" value={email} onChange={e => setEmail(e.target.value)} required className="w-full border p-3" /></div>
            <div><label className="block text-sm font-medium mb-1">Password</label><input type="password" value={password} onChange={e => setPassword(e.target.value)} required className="w-full border p-3" /></div>
            <button type="submit" disabled={loading} className="w-full bg-[#1B3A4B] text-white py-3 font-medium hover:bg-[#0A0A0A] transition disabled:opacity-50">{loading ? "Logging in..." : "Login"}</button>
          </form>
        </div>
      </Container>
    </main>
  )
}