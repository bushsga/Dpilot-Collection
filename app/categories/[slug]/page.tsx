import Container from "@/components/Container"
import ProductCard from "@/components/ProductCard"
import { createServerSupabaseClient } from "@/lib/supabase/server"
import { notFound } from "next/navigation"
import type { Product } from "@/types"

export default async function CategoryPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const supabase = await createServerSupabaseClient()

  // Fetch the category to confirm it exists
  const { data: category } = await supabase
    .from('categories')
    .select('*')
    .eq('slug', slug)
    .single()

  if (!category) notFound()

  // Fetch products in this category
  const { data: products } = await supabase
    .from('products')
    .select('*')
    .eq('category_slug', slug)
    .eq('in_stock', true)
    .order('created_at', { ascending: false })

  return (
    <main className="py-20 bg-[#F7F5F2] min-h-screen">
      <Container>
        <div className="mb-12">
          <h1 className="text-3xl sm:text-4xl font-bold mb-2">{category.name}</h1>
          <p className="text-[#6B7280]">{(products || []).length} product{(products || []).length !== 1 ? 's' : ''} found</p>
        </div>

        {(products || []).length === 0 ? (
          <div className="text-center py-20 bg-white">
            <p className="text-[#6B7280]">No products in this category yet.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {(products || []).map((product: Product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </Container>
    </main>
  )
}