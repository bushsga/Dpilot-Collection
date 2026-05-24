import Container from "@/components/Container"
import { createServerSupabaseClient } from "@/lib/supabase/server"
import Link from "next/link"
import type { Category } from "@/types"

export default async function CategoriesPage() {
  const supabase = await createServerSupabaseClient()
  const { data: categories } = await supabase.from('categories').select('*').order('name')

  return (
    <main className="py-20 bg-white min-h-screen">
      <Container>
        <h1 className="text-3xl font-bold mb-8">Shop by Category</h1>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {(categories || []).map((cat: Category) => (
            <Link key={cat.id} href={`/products?category=${cat.slug}`} className="bg-[#F7F5F2] p-10 text-center border hover:border-[#1B3A4B] transition-all">
              <h3 className="text-lg font-semibold">{cat.name}</h3>
            </Link>
          ))}
        </div>
      </Container>
    </main>
  )
}