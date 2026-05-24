"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Menu, X, ShoppingCart, ShoppingBag, Package, Phone } from "lucide-react"
import Container from "./Container"
import { useCart } from "@/context/CartContext"

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [mounted, setMounted] = useState(false)
  const { totalItems } = useCart()

  useEffect(() => {
    setMounted(true)
    const handleScroll = () => setScrolled(window.scrollY > 10)
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const navLinks = [
    { name: "Shop", href: "/products", icon: ShoppingBag },
    { name: "Orders", href: "/my-orders", icon: Package },
    { name: "Contact", href: "/contact", icon: Phone },
  ]

  return (
    <header className={`fixed top-0 left-0 right-0 w-full bg-white transition-all duration-300 z-100 ${scrolled ? "shadow-lg" : "shadow-sm"}`}>
      <Container>
        <div className="flex items-center justify-between py-4">
          {/* Logo */}
          <Link href="/" className="text-xl font-bold tracking-tight shrink-0">
            DPiLOT <span className="text-[#1B3A4B]">COLLECTION</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-6">
            {navLinks.map((link) => {
              const Icon = link.icon
              return (
                <Link key={link.name} href={link.href} className="flex items-center gap-1.5 text-sm hover:text-[#1B3A4B] transition">
                  <Icon className="w-4 h-4" />
                  {link.name}
                </Link>
              )
            })}
          </div>

          {/* Cart & Mobile Menu Button */}
          <div className="flex items-center gap-6 shrink-0">
            <Link href="/cart" className="text-sm font-medium relative">
              <ShoppingCart className="w-5 h-5" />
              {mounted && totalItems > 0 && (
                <span className="absolute -top-2 -right-2 bg-[#1B3A4B] text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
                  {totalItems}
                </span>
              )}
            </Link>
            <button onClick={() => setIsOpen(!isOpen)} className="md:hidden">
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <nav className="md:hidden py-4 border-t">
            <div className="flex flex-col gap-3">
              {navLinks.map((link) => {
                const Icon = link.icon
                return (
                  <Link key={link.name} href={link.href} onClick={() => setIsOpen(false)} className="flex items-center gap-3 p-2 hover:bg-gray-50 transition">
                    <Icon className="w-5 h-5 text-[#1B3A4B]" />
                    <span>{link.name}</span>
                  </Link>
                )
              })}
            </div>
          </nav>
        )}
      </Container>
    </header>
  )
}