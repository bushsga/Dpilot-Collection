"use client"

import { useState } from "react"
import Container from "@/components/Container"
import { Mail, Phone, MapPin, CheckCircle } from "lucide-react"
import Link from "next/link"

export default function ContactPage() {
  const [formData, setFormData] = useState({ name: "", email: "", phone: "", message: "" })
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); setLoading(true)
    try {
      const res = await fetch("https://formspree.io/f/YOUR_FORM_ID", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...formData, _subject: `New inquiry from ${formData.name}` })
      })
      if (res.ok) { setSubmitted(true); setFormData({ name: "", email: "", phone: "", message: "" }) }
      else alert("Something went wrong. Please try again.")
    } catch { alert("Failed to send message.") }
    finally { setLoading(false) }
  }

  if (submitted) {
    return (
      <main className="py-20 bg-white min-h-screen">
        <Container>
          <div className="max-w-md mx-auto text-center">
            <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
            <h1 className="text-2xl font-semibold mb-2">Thank You!</h1>
            <p className="text-[#6B7280] mb-6">We&apos;ve received your message and will get back to you shortly.</p>
            <Link href="/" className="bg-[#1B3A4B] text-white px-6 py-3 hover:bg-[#0A0A0A] transition">Return Home</Link>
          </div>
        </Container>
      </main>
    )
  }

  return (
    <main className="py-20 bg-white">
      <Container>
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h1 className="text-4xl font-semibold mb-4">Contact Us</h1>
          <p className="text-[#6B7280]">Have questions? We&apos;d love to hear from you.</p>
        </div>

        {/* Contact Info Cards */}
        <div className="grid md:grid-cols-3 gap-8 mb-12">
          <div className="text-center p-6 bg-[#F7F5F2]">
            <Phone className="w-8 h-8 text-[#1B3A4B] mx-auto mb-3" />
            <h3 className="font-medium mb-2">Phone</h3>
            <p className="text-[#6B7280]">+234 805 335 6264</p>
          </div>
          <div className="text-center p-6 bg-[#F7F5F2]">
            <Mail className="w-8 h-8 text-[#1B3A4B] mx-auto mb-3" />
            <h3 className="font-medium mb-2">Email</h3>
            <p className="text-[#6B7280]">olanrewajuabdulquayum@gmail.com</p>
          </div>
          <div className="text-center p-6 bg-[#F7F5F2]">
            <MapPin className="w-8 h-8 text-[#1B3A4B] mx-auto mb-3" />
            <h3 className="font-medium mb-2">Location</h3>
            <p className="text-[#6B7280]">Nigeria</p>
          </div>
        </div>

        {/* Contact Form */}
        <div className="max-w-2xl mx-auto">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Name *</label>
              <input type="text" required value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full border p-3" placeholder="Your full name" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Email *</label>
                <input type="email" required value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} className="w-full border p-3" placeholder="your@email.com" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Phone *</label>
                <input type="tel" required value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} className="w-full border p-3" placeholder="08012345678" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Message *</label>
              <textarea required rows={5} value={formData.message} onChange={e => setFormData({...formData, message: e.target.value})} className="w-full border p-3 resize-none" placeholder="How can we help you?" />
            </div>
            <button type="submit" disabled={loading} className="w-full bg-[#1B3A4B] text-white py-3 font-medium hover:bg-[#0A0A0A] transition disabled:opacity-50">
              {loading ? "Sending..." : "Send Message"}
            </button>
          </form>
        </div>
      </Container>
    </main>
  )
}