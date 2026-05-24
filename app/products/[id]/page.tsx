import Container from "@/components/Container"
import { createServerSupabaseClient } from "@/lib/supabase/server"
import { notFound } from "next/navigation"
import type { Product, ProductVariant } from "@/types"
import ProductDetailClient from "@/components/ProductDetailClient"

export default async function ProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createServerSupabaseClient()
  
  const { data: product } = await supabase.from('products').select('*').eq('id', id).single()
  if (!product) notFound()
  
  const { data: variants } = await supabase.from('product_variants').select('*').eq('product_id', id).order('created_at')

  return (
    <main className="py-12 bg-white min-h-screen">
      <Container>
        <ProductDetailClient product={product as Product} variants={(variants || []) as ProductVariant[]} />
      </Container>
    </main>
  )
}