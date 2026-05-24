"use client"

import { useState } from "react"
import Container from "@/components/Container"
import { createClient } from "@/lib/supabase/client"
import type { Order } from "@/types"

export default function MyOrdersPage() {
  const [email, setEmail] = useState("")
  const [orders, setOrders] = useState<Order[]>([])
  const [searched, setSearched] = useState(false)
  const [loading, setLoading] = useState(false)
  const supabase = createClient()

  const handleLookup = async (e: React.FormEvent) => {
    e.preventDefault(); setLoading(true); setSearched(true)
    const { data } = await supabase.from('orders').select('*').eq('customer_email', email.toLowerCase().trim()).order('created_at', { ascending: false })
    setOrders((data || []) as Order[]); setLoading(false)
  }

  return (
    <main className="py-20 bg-white min-h-screen">
      <Container>
        <h1 className="text-3xl font-bold mb-8">Track Your Orders</h1>
        <form onSubmit={handleLookup} className="flex gap-3 mb-8 max-w-md">
          <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="Enter your email" required className="flex-1 border p-3" />
          <button type="submit" disabled={loading} className="bg-[#1B3A4B] text-white px-6 py-3 font-medium hover:bg-[#0A0A0A] transition disabled:opacity-50">{loading ? 'Searching...' : 'Look Up'}</button>
        </form>
        {searched && orders.length === 0 && <p className="text-[#6B7280] text-center py-10">No orders found.</p>}
        {orders.map((order: Order) => (
          <div key={order.id} className="bg-white border p-6 mb-4">
            <div className="flex justify-between mb-3"><span className="text-xs text-[#6B7280]">Order: {order.id.slice(0,8)}...</span><span className={`text-xs px-2 py-1 ${order.status === 'paid' ? 'bg-green-100 text-green-700' : order.status === 'shipped' ? 'bg-blue-100 text-blue-700' : 'bg-yellow-100 text-yellow-700'}`}>{order.status.toUpperCase()}</span></div>
            {(order.items as any[]).map((item: any, i: number) => <div key={i} className="flex justify-between text-sm"><span>{item.product_name} {item.color_name && `(${item.color_name})`} {item.size && `- ${item.size}`} x{item.quantity}</span><span>₦{(item.price * item.quantity).toLocaleString()}</span></div>)}
            <div className="border-t pt-3 mt-3 flex justify-between font-semibold"><span>Total</span><span>₦{order.total_amount.toLocaleString()}</span></div>
            {order.tracking_number && <p className="mt-3 text-sm text-[#1B3A4B]">🚚 Tracking: {order.tracking_number}</p>}
          </div>
        ))}
      </Container>
    </main>
  )
}