"use client"

import Container from "@/components/Container"
import Link from "next/link"
import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"
import type { Product, ProductVariant } from "@/types"

export default function AdminDashboard() {
  const [lowStockProducts, setLowStockProducts] = useState<Product[]>([])
  const [lowStockVariants, setLowStockVariants] = useState<{ variant: ProductVariant; productName: string }[]>([])
  const supabase = createClient()

  useEffect(() => {
    const check = async () => {
      const { data: prods } = await supabase.from('products').select('*').lte('quantity', 3).gt('quantity', -1).order('quantity')
      if (prods) setLowStockProducts(prods as Product[])
      const { data: vars } = await supabase.from('product_variants').select('*, products(name)').lte('quantity', 3).gt('quantity', -1).order('quantity')
      if (vars) setLowStockVariants((vars as any[]).map(v => ({ variant: v as ProductVariant, productName: v.products?.name || 'Unknown' })))
    }
    check()
  }, [])

  const totalLowStock = lowStockProducts.length + lowStockVariants.length

  return (
    <Container>
      <h1 className="text-3xl font-semibold mb-8">Dashboard</h1>

      {totalLowStock > 0 && (
        <div className="bg-orange-50 border border-orange-200 p-6 mb-8">
          <h2 className="text-lg font-semibold text-orange-800 mb-3">⚠️ Low Stock Alert ({totalLowStock})</h2>
          {lowStockProducts.map(p => <p key={p.id} className="text-sm text-orange-600">{p.name}: {p.quantity} left</p>)}
          {lowStockVariants.map(v => <p key={v.variant.id} className="text-sm text-orange-600">{v.productName} - {v.variant.color_name}: {v.variant.quantity} left</p>)}
        </div>
      )}

      <div className="grid md:grid-cols-3 gap-6">
        <Link href="/admin/products" className="bg-white p-6 shadow-sm hover:shadow-md transition"><h2 className="text-xl font-semibold mb-2">Products</h2><p className="text-[#6B7280]">Manage your shoe collection</p><div className="mt-4 text-[#1B3A4B]">View Products →</div></Link>
        <Link href="/admin/categories" className="bg-white p-6 shadow-sm hover:shadow-md transition"><h2 className="text-xl font-semibold mb-2">Categories</h2><p className="text-[#6B7280]">Organize your products</p><div className="mt-4 text-[#1B3A4B]">View Categories →</div></Link>
        <Link href="/admin/orders" className="bg-white p-6 shadow-sm hover:shadow-md transition"><h2 className="text-xl font-semibold mb-2">Orders</h2><p className="text-[#6B7280]">View and manage orders</p><div className="mt-4 text-[#1B3A4B]">View Orders →</div></Link>
      </div>
    </Container>
  )
}