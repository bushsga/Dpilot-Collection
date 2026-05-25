"use client"

import { useEffect, useState } from "react"
import { useRouter, usePathname } from "next/navigation"
import { useAuth } from "@/context/AuthContext"
import Link from "next/link"
import { LayoutDashboard, Package, ShoppingBag, LogOut, FolderOpen } from "lucide-react"
import Script from "next/script"

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { user, loading, signOut } = useAuth()
  const router = useRouter()
  const pathname = usePathname()
  const [mounted, setMounted] = useState(false)
  const isLoginPage = pathname === "/admin/login"

  useEffect(() => {
    setMounted(true)
  }, [])

  const handleLogout = async () => {
    await signOut()
    router.push("/admin/login")
  }

  if (!mounted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F7F5F2]">
        <div className="text-xl text-[#6B7280]">Loading...</div>
      </div>
    )
  }

  if (isLoginPage) {
    return <>{children}</>
  }

  if (!user && !loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F7F5F2]">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-[#0A0A0A] mb-4">Admin Access</h1>
          <p className="text-[#6B7280] mb-6">Please log in to access the admin panel.</p>
          <Link href="/admin/login" className="bg-[#1B3A4B] text-white px-8 py-3 font-medium hover:bg-[#0A0A0A] transition">
            Go to Login
          </Link>
        </div>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F7F5F2]">
        <div className="text-xl text-[#6B7280]">Checking auth...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#F7F5F2]">
      {/* Load Cloudinary script directly in admin */}
      <Script 
        src="https://upload-widget.cloudinary.com/global/all.js" 
        strategy="beforeInteractive"
      />
      
      <nav className="bg-[#0A0A0A] text-white sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <div className="text-xl font-semibold">DPiLOT <span className="text-[#1B3A4B]">ADMIN</span></div>
            <div className="flex items-center gap-4 md:gap-6">
              <Link href="/admin" className="flex items-center gap-2 hover:text-[#1B3A4B] transition text-sm"><LayoutDashboard className="w-4 h-4" /><span className="hidden sm:inline">Dashboard</span></Link>
              <Link href="/admin/products" className="flex items-center gap-2 hover:text-[#1B3A4B] transition text-sm"><Package className="w-4 h-4" /><span className="hidden sm:inline">Products</span></Link>
              <Link href="/admin/categories" className="flex items-center gap-2 hover:text-[#1B3A4B] transition text-sm"><FolderOpen className="w-4 h-4" /><span className="hidden sm:inline">Categories</span></Link>
              <Link href="/admin/orders" className="flex items-center gap-2 hover:text-[#1B3A4B] transition text-sm"><ShoppingBag className="w-4 h-4" /><span className="hidden sm:inline">Orders</span></Link>
              <button onClick={handleLogout} className="flex items-center gap-2 hover:text-[#1B3A4B] transition text-sm"><LogOut className="w-4 h-4" /><span className="hidden sm:inline">Logout</span></button>
            </div>
          </div>
        </div>
      </nav>
      <div className="py-8">{children}</div>
    </div>
  )
}