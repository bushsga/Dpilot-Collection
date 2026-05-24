import Container from "@/components/Container"
import ProductCard from "@/components/ProductCard"
import { createServerSupabaseClient } from "@/lib/supabase/server"
import Link from "next/link"
import type { Product, Category } from "@/types"

type Props = {
  searchParams: Promise<{ category?: string }>
}

export default async function ProductsPage({ searchParams }: Props) {
  const { category } = await searchParams
  const supabase = await createServerSupabaseClient()
  
  const { data: categories } = await supabase.from('categories').select('*').order('name')
  
  let query = supabase.from('products').select('*').eq('in_stock', true).order('created_at', { ascending: false })
  if (category) query = query.eq('category_slug', category)
  
  const { data: products } = await query
  const categoryName = category ? categories?.find((c: Category) => c.slug === category)?.name : 'All Products'

  return (
    <main className="py-20 bg-[#F7F5F2] min-h-screen">
      <Container>
        <div className="mb-12">
          <h1 className="text-3xl sm:text-4xl font-bold mb-2">{categoryName || 'All Products'}</h1>
          <p className="text-[#6B7280]">{(products || []).length} product{(products || []).length !== 1 ? 's' : ''} found</p>
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap gap-2 mb-8">
          <Link href="/products" className={`px-4 py-2 text-sm border ${!category ? 'bg-[#1B3A4B] text-white border-[#1B3A4B]' : 'border-gray-200 hover:border-[#1B3A4B]'}`}>All</Link>
          {(categories || []).map((cat: Category) => (
            <Link key={cat.id} href={`/products?category=${cat.slug}`} className={`px-4 py-2 text-sm border ${category === cat.slug ? 'bg-[#1B3A4B] text-white border-[#1B3A4B]' : 'border-gray-200 hover:border-[#1B3A4B]'}`}>{cat.name}</Link>
          ))}
        </div>

        {(products || []).length === 0 ? (
          <div className="text-center py-20 bg-white">
            <p className="text-[#6B7280] mb-4">No products found.</p>
            <Link href="/products" className="text-[#1B3A4B] underline">View all products</Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {(products || []).map((product: Product) => <ProductCard key={product.id} product={product} />)}
          </div>
        )}
      </Container>
    </main>
  )
}