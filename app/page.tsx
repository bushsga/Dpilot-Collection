import Container from "@/components/Container"
import ProductCard from "@/components/ProductCard"
import HeroSlideshow from "@/components/HeroSlideshow"
import Testimonials from "@/components/Testimonials"
import { createServerSupabaseClient } from "@/lib/supabase/server"
import Link from "next/link"
import type { Category, Product } from "@/types"


export default async function Home() {
  const supabase = await createServerSupabaseClient();
  const { data: categories } = await supabase.from('categories').select('*').order('name');
  const { data: featured } = await supabase.from('products').select('*').eq('in_stock', true).eq('featured', true).limit(8).order('created_at', { ascending: false });
  const { data: latest } = await supabase.from('products').select('*').eq('in_stock', true).limit(8).order('created_at', { ascending: false });
  const products = (featured && featured.length > 0 ? featured : latest || []) as Product[];

  return (
    <main>
      <HeroSlideshow />

      <section className="py-20 bg-white">
        <Container>
          <h2 className="text-2xl font-bold text-center mb-8">Shop by Category</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {(categories || []).map((cat: Category) => (
              <Link key={cat.id} href={`/categories/${cat.slug}`} className="group bg-[#F7F5F2] p-10 text-center border hover:border-[#1B3A4B] transition-all">
                <h3 className="text-lg font-semibold text-[#0A0A0A] group-hover:text-[#1B3A4B] transition-colors">{cat.name}</h3>
              </Link>
            ))}
          </div>
        </Container>
      </section>

      <section className="py-20 bg-[#F7F5F2]">
        <Container>
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl font-bold text-[#0A0A0A]">{featured?.length ? 'Featured Picks' : 'New Arrivals'}</h2>
            <Link href="/products" className="text-sm text-[#1B3A4B] hover:underline">View All →</Link>
          </div>
          {products.length === 0 ? (
            <p className="text-center text-[#6B7280] py-20">No products yet. Check back soon!</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {products.map((product: Product) => <ProductCard key={product.id} product={product} />)}
            </div>
          )}
        </Container>
      </section>

      <Testimonials />

      <section className="py-12 bg-white border-t">
        <Container>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div><h3 className="font-semibold mb-2">Original Quality</h3><p className="text-sm text-[#6B7280]">100% authentic products</p></div>
            <div><h3 className="font-semibold mb-2">Fully Boxed</h3><p className="text-sm text-[#6B7280]">Complete with original packaging</p></div>
            <div><h3 className="font-semibold mb-2">Fast Delivery</h3><p className="text-sm text-[#6B7280]">Nationwide shipping</p></div>
          </div>
        </Container>
      </section>
    </main>
  );
}
