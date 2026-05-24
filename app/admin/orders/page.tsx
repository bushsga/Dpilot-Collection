"use client"

import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"
import type { Order } from "@/types"
import Container from "@/components/Container"

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => { fetchOrders() }, [])

  const fetchOrders = async () => {
    const { data } = await supabase.from('orders').select('*').order('created_at', { ascending: false })
    if (data) setOrders(data as Order[])
    setLoading(false)
  }

  const updateStatus = async (orderId: string, status: string) => {
    await supabase.from('orders').update({ status }).eq('id', orderId)
    fetchOrders()
  }

  return (
    <Container>
      <h1 className="text-3xl font-semibold mb-8">Orders ({orders.length})</h1>
      {loading ? <p>Loading...</p> : orders.length === 0 ? <p className="text-[#6B7280] text-center py-20">No orders yet.</p> : (
        <div className="space-y-4">
          {orders.map((o: Order) => (
            <div key={o.id} className="bg-white p-4 shadow-sm">
              <div className="flex justify-between mb-2">
                <span className="font-medium">{o.customer_name}</span>
                <span className="font-semibold">₦{o.total_amount.toLocaleString()}</span>
              </div>
              <p className="text-sm text-[#6B7280]">{o.customer_email} • {o.customer_phone}</p>
              <div className="flex gap-2 mt-3">
                {['pending', 'paid', 'shipped', 'delivered'].map(s => (
                  <button key={s} onClick={() => updateStatus(o.id, s)} className={`text-xs px-3 py-1 border ${o.status === s ? 'bg-[#1B3A4B] text-white' : 'hover:border-[#1B3A4B]'}`}>{s}</button>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </Container>
  )
}