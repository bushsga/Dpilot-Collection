"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import type { Category } from "@/types"
import Container from "@/components/Container"
import ImageUpload from "@/components/ImageUpload"
import { FiPlus, FiTrash2 } from "react-icons/fi"

export default function NewProductPage() {
  const router = useRouter()
  const supabase = createClient()
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({
    name: "", description: "", price: "", category_slug: "",
    sizes: "", images: [] as string[], quantity: "1", in_stock: true, featured: false
  })

  useEffect(() => {
    supabase.from('categories').select('*').order('name').then(({ data }) => {
      if (data) setCategories(data as Category[])
    })
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); setLoading(true)
    const sizesArray = form.sizes.split(',').map(s => parseInt(s.trim())).filter(n => !isNaN(n))
    const { error } = await supabase.from('products').insert([{
      name: form.name, description: form.description, price: parseFloat(form.price),
      category_slug: form.category_slug || null, sizes: sizesArray, images: form.images,
      quantity: parseInt(form.quantity), in_stock: form.in_stock, featured: form.featured
    }])
    if (!error) router.push('/admin/products')
    else { alert(error.message); setLoading(false) }
  }

  return (
    <Container>
      <h1 className="text-3xl font-semibold mb-8">Add New Product</h1>
      <form onSubmit={handleSubmit} className="max-w-3xl space-y-6">
        <div><label className="block text-sm font-medium mb-1">Product Name *</label><input value={form.name} onChange={e => setForm({...form, name: e.target.value})} required className="w-full border p-3" /></div>
        <div><label className="block text-sm font-medium mb-1">Description</label><textarea value={form.description} onChange={e => setForm({...form, description: e.target.value})} rows={3} className="w-full border p-3" /></div>
        <div className="grid grid-cols-2 gap-4">
          <div><label className="block text-sm font-medium mb-1">Price (₦) *</label><input type="number" value={form.price} onChange={e => setForm({...form, price: e.target.value})} required className="w-full border p-3" /></div>
          <div><label className="block text-sm font-medium mb-1">Stock *</label><input type="number" value={form.quantity} onChange={e => setForm({...form, quantity: e.target.value})} required className="w-full border p-3" /></div>
        </div>
        <div><label className="block text-sm font-medium mb-1">Category</label><select value={form.category_slug} onChange={e => setForm({...form, category_slug: e.target.value})} className="w-full border p-3"><option value="">Select</option>{categories.map(c => <option key={c.id} value={c.slug}>{c.name}</option>)}</select></div>
        <div><label className="block text-sm font-medium mb-1">Sizes (comma-separated)</label><input value={form.sizes} onChange={e => setForm({...form, sizes: e.target.value})} className="w-full border p-3" placeholder="41, 42, 43, 44, 45" /></div>
        <div><label className="block text-sm font-medium mb-1">Product Images</label><ImageUpload images={form.images} onChange={imgs => setForm({...form, images: imgs})} /></div>
        <div className="flex gap-6">
          <label className="flex items-center gap-2"><input type="checkbox" checked={form.in_stock} onChange={e => setForm({...form, in_stock: e.target.checked})} /> In Stock</label>
          <label className="flex items-center gap-2"><input type="checkbox" checked={form.featured} onChange={e => setForm({...form, featured: e.target.checked})} /> Featured</label>
        </div>
        <div className="flex gap-4">
          <button type="submit" disabled={loading} className="bg-[#1B3A4B] text-white px-8 py-3 font-medium hover:bg-[#0A0A0A] transition disabled:opacity-50">{loading ? 'Saving...' : 'Add Product'}</button>
          <button type="button" onClick={() => router.back()} className="border px-8 py-3">Cancel</button>
        </div>
      </form>
    </Container>
  )
}