"use client"

import { useEffect, useState } from "react"
import { FiPlus, FiEdit2, FiTrash2 } from "react-icons/fi"
import { createClient } from "@/lib/supabase/client"
import type { Category } from "@/types"
import Container from "@/components/Container"

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({ name: "", slug: "" })
  const supabase = createClient()

  useEffect(() => { fetchCategories() }, [])

  const fetchCategories = async () => {
    const { data } = await supabase.from('categories').select('*').order('name')
    if (data) setCategories(data as Category[])
    setLoading(false)
  }

  const handleNameChange = (name: string) => {
    const slug = name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')
    setForm({ name, slug })
  }

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.name.trim()) return
    await supabase.from('categories').insert([{ name: form.name.trim(), slug: form.slug }])
    setForm({ name: "", slug: "" })
    setShowForm(false)
    fetchCategories()
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this category?")) return
    await supabase.from('categories').delete().eq('id', id)
    fetchCategories()
  }

  return (
    <Container>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-semibold">Categories ({categories.length})</h1>
        <button onClick={() => setShowForm(!showForm)} className="flex items-center gap-2 bg-[#1B3A4B] text-white px-6 py-3 text-sm font-medium hover:bg-[#0A0A0A] transition"><FiPlus /> Add Category</button>
      </div>
      {showForm && (
        <form onSubmit={handleAdd} className="bg-white p-6 shadow-sm mb-6 flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <input
              type="text"
              value={form.name}
              onChange={e => handleNameChange(e.target.value)}
              placeholder="Category name (e.g., Sneakers)"
              required
              className="w-full border p-3"
            />
            <p className="text-xs text-[#6B7280] mt-1">Slug: {form.slug || 'auto-generated'}</p>
          </div>
          <button type="submit" className="bg-[#1B3A4B] text-white px-6 py-3 text-sm font-medium hover:bg-[#0A0A0A] transition">Save</button>
        </form>
      )}
      {loading ? <p>Loading...</p> : categories.length === 0 ? <p className="text-[#6B7280] text-center py-20">No categories yet.</p> : (
        <div className="space-y-2">
          {categories.map((c: Category) => (
            <div key={c.id} className="bg-white p-4 shadow-sm flex justify-between items-center">
              <span className="font-medium">{c.name} <span className="text-[#6B7280] text-sm">/{c.slug}</span></span>
              <button onClick={() => handleDelete(c.id)} className="text-red-500"><FiTrash2 size={16} /></button>
            </div>
          ))}
        </div>
      )}
    </Container>
  )
}