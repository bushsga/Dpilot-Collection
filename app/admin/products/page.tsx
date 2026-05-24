"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { FiPlus, FiEdit2, FiTrash2, FiRefreshCw } from "react-icons/fi"
import { createClient } from "@/lib/supabase/client"
import type { Product } from "@/types"
import Container from "@/components/Container"

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [restockingId, setRestockingId] = useState<string | null>(null)
  const [restockQty, setRestockQty] = useState<number>(10)
  const supabase = createClient()

  useEffect(() => { fetchProducts() }, [])

  const fetchProducts = async () => {
    const { data } = await supabase.from('products').select('*').order('created_at', { ascending: false })
    if (data) setProducts(data as Product[])
    setLoading(false)
  }

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Delete "${name}"?`)) return
    await supabase.from('products').delete().eq('id', id)
    setProducts(products.filter(p => p.id !== id))
  }

  const handleRestock = async (productId: string) => {
    if (restockQty <= 0) return
    await supabase.rpc('restock_product', { product_id: productId, qty: restockQty })
    setProducts(products.map(p => p.id === productId ? { ...p, quantity: p.quantity + restockQty } : p))
    setRestockingId(null)
  }

  return (
    <Container>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-semibold">Products ({products.length})</h1>
        <Link href="/admin/products/new" className="flex items-center gap-2 bg-[#1B3A4B] text-white px-6 py-3 text-sm font-medium hover:bg-[#0A0A0A] transition"><FiPlus /> Add Product</Link>
      </div>
      {loading ? <p>Loading...</p> : products.length === 0 ? <p className="text-[#6B7280] text-center py-20">No products yet.</p> : (
        <div className="space-y-3">
          {products.map((p: Product) => (
            <div key={p.id} className="bg-white p-4 shadow-sm flex flex-col sm:flex-row justify-between gap-3">
              <div>
                <h3 className="font-medium">{p.name}</h3>
                <p className="text-[#1B3A4B] font-semibold">₦{p.price.toLocaleString()}</p>
                <p className="text-sm text-[#6B7280]">Stock: {p.quantity} | Category: {p.category_slug || 'None'}</p>
              </div>
              <div className="flex items-center gap-3">
                {restockingId === p.id ? (
                  <div className="flex items-center gap-1">
                    <input type="number" min="1" value={restockQty} onChange={e => setRestockQty(parseInt(e.target.value) || 0)} className="w-16 border px-2 py-1 text-xs" />
                    <button onClick={() => handleRestock(p.id)} className="bg-green-600 text-white text-xs px-2 py-1">✓</button>
                    <button onClick={() => setRestockingId(null)} className="text-red-500 text-xs">✕</button>
                  </div>
                ) : (
                  <button onClick={() => { setRestockingId(p.id); setRestockQty(10) }} className="text-sm text-[#6B7280] hover:text-green-600"><FiRefreshCw size={14} /> Restock</button>
                )}
                {/* CORRECT EDIT LINK */}
                <Link href={`/admin/products/edit/${p.id}`} className="text-[#1B3A4B]"><FiEdit2 size={16} /></Link>
                <button onClick={() => handleDelete(p.id, p.name)} className="text-red-500"><FiTrash2 size={16} /></button>
              </div>
            </div>
          ))}
        </div>
      )}
    </Container>
  )
}