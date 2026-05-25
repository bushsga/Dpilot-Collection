"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useCart } from "@/context/CartContext"
import Container from "@/components/Container"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"

declare global { interface Window { PaystackPop: { setup: (o: any) => { openIframe: () => void } }; __DPILOT_PAYSTACK_KEY__: string } }

export default function CheckoutPage() {
  const { items, totalPrice, clearCart } = useCart()
  const router = useRouter()
  const [mounted, setMounted] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [form, setForm] = useState({ name: "", email: "", phone: "", address: "" })

  useEffect(() => { setMounted(true) }, [])
  if (!mounted) return <div className="py-20 text-center">Loading checkout...</div>
  if (items.length === 0) return (
    <main className="py-20 min-h-screen">
      <Container>
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Your cart is empty</h1>
          <Link href="/products" className="text-[#1B3A4B] underline">Go shopping</Link>
        </div>
      </Container>
    </main>
  )

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => setForm(p => ({ ...p, [e.target.name]: e.target.value }))

  const verifyPayment = async (ref: string, orderId: string) => {
    try {
      const res = await fetch('/api/verify-payment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reference: ref, orderId })
      })
      const data = await res.json()
      if (data.success) {
        try {
          const { sendOrderEmails } = await import('@/lib/email')
          const itemsList = items.map(i => `${i.product.name} (Size: ${i.size || 'N/A'}) x${i.quantity}`).join(', ')
          await sendOrderEmails({
            orderId, customer_name: form.name, customer_email: form.email,
            customer_phone: form.phone, customer_address: form.address,
            items_list: itemsList, total_amount: totalPrice
          })
        } catch {}
        clearCart()
        router.push('/checkout/success')
      } else {
        setError(data.error || 'Verification failed')
        setLoading(false)
      }
    } catch {
      setError('Verification failed. Please contact support.')
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setLoading(true)

    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customer_name: form.name,
          customer_email: form.email,
          customer_phone: form.phone,
          customer_address: form.address,
          items: items.map(i => ({
            product_id: i.product.id,
            product_name: i.product.name,
            variant_id: i.variant?.id,
            color_name: i.variant?.color_name,
            size: i.size,
            price: i.product.price,
            quantity: i.quantity
          })),
          total_amount: totalPrice
        })
      })

      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Failed to create order')

      // Get key from window object (loaded from /paystack-key.js)
      const key = window.__DPILOT_PAYSTACK_KEY__ || ''

      const handler = window.PaystackPop.setup({
        key: key,
        email: form.email,
        amount: totalPrice * 100,
        currency: 'NGN',
        ref: data.paystackReference,
        metadata: { order_id: data.orderId },
        onClose: () => {
          setLoading(false)
          setError("Payment was not completed.")
        },
        callback: (response: any) => {
          verifyPayment(response.reference, data.orderId)
        }
      })

      handler.openIframe()
    } catch (err: any) {
      setError(err.message || 'Something went wrong')
      setLoading(false)
    }
  }

  return (
    <main className="py-12 md:py-20 bg-white min-h-screen">
      <Container>
        <Link href="/cart" className="inline-flex items-center gap-2 text-sm text-[#6B7280] hover:text-[#1B3A4B] mb-6 transition-colors">
          <ArrowLeft size={16} /> Back to Cart
        </Link>
        <h1 className="text-2xl md:text-3xl font-semibold mb-8">Checkout</h1>
        <div className="block lg:hidden mb-8">
          <div className="bg-[#F7F5F2] p-6">
            <h2 className="text-lg font-bold mb-4 pb-3 border-b">Your Order</h2>
            <div className="space-y-2 mb-4">
              {items.map((item) => (
                <div key={`${item.product.id}-${item.variant?.id || 'x'}-${item.size}`} className="flex justify-between text-sm">
                  <span className="truncate max-w-[180px]">{item.product.name} {item.variant && `(${item.variant.color_name})`} x{item.quantity}</span>
                  <span className="font-medium whitespace-nowrap">₦{(item.product.price * item.quantity).toLocaleString()}</span>
                </div>
              ))}
            </div>
            <div className="border-t pt-3 flex justify-between font-bold text-lg"><span>Total</span><span className="text-[#1B3A4B]">₦{totalPrice.toLocaleString()}</span></div>
          </div>
        </div>
        <div className="grid lg:grid-cols-3 gap-8">
          <form onSubmit={handleSubmit} className="lg:col-span-2 space-y-4">
            {error && <div className="bg-red-50 border border-red-200 text-red-700 text-sm p-4">{error}</div>}
            <div><label className="block text-sm font-medium mb-1">Full Name *</label><input name="name" value={form.name} onChange={handleChange} required className="w-full border p-3" placeholder="John Doe" /></div>
            <div><label className="block text-sm font-medium mb-1">Email *</label><input type="email" name="email" value={form.email} onChange={handleChange} required className="w-full border p-3" placeholder="john@example.com" /></div>
            <div><label className="block text-sm font-medium mb-1">Phone Number *</label><input type="tel" name="phone" value={form.phone} onChange={handleChange} required className="w-full border p-3" placeholder="08012345678" /></div>
            <div><label className="block text-sm font-medium mb-1">Delivery Address *</label><textarea name="address" value={form.address} onChange={handleChange} required rows={3} className="w-full border p-3 resize-none" placeholder="Enter your full delivery address" /></div>
            <button type="submit" disabled={loading} className="w-full bg-[#1B3A4B] text-white py-4 font-semibold hover:bg-[#0A0A0A] transition disabled:opacity-50 text-sm">{loading ? 'Processing...' : `Pay ₦${totalPrice.toLocaleString()}`}</button>
          </form>
          <div className="hidden lg:block lg:col-span-1">
            <div className="bg-[#F7F5F2] p-6 sticky top-24">
              <h2 className="text-lg font-bold mb-4 pb-3 border-b">Your Order</h2>
              <div className="space-y-2 mb-4 max-h-80 overflow-y-auto">
                {items.map((item) => (
                  <div key={`${item.product.id}-${item.variant?.id || 'x'}-${item.size}`} className="flex justify-between text-sm">
                    <span className="truncate max-w-[180px]">{item.product.name} {item.variant && `(${item.variant.color_name})`} x{item.quantity}</span>
                    <span className="font-medium whitespace-nowrap">₦{(item.product.price * item.quantity).toLocaleString()}</span>
                  </div>
                ))}
              </div>
              <div className="border-t pt-3 flex justify-between font-bold text-lg"><span>Total</span><span className="text-[#1B3A4B]">₦{totalPrice.toLocaleString()}</span></div>
            </div>
          </div>
        </div>
      </Container>
    </main>
  )
}