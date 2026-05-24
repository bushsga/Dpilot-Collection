"use client"

import { useState } from "react"
import type { Product, ProductVariant } from "@/types"
import AddToCartButton from "@/components/AddToCartButton"
import ProductImageGallery from "@/components/ProductImageGallery"

export default function ProductDetailClient({ product, variants }: { product: Product; variants: ProductVariant[] }) {
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(() => {
    const available = variants.find(v => v.quantity > 0)
    return available || variants[0] || null
  })

  const displayImages = selectedVariant?.images?.length ? selectedVariant.images : product.images
  const availableStock = selectedVariant ? selectedVariant.quantity : product.quantity

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
      <div><ProductImageGallery images={displayImages} productName={product.name} /></div>
      <div className="space-y-6">
        {product.category_slug && <p className="text-xs text-[#1B3A4B] uppercase tracking-widest">{product.category_slug}</p>}
        <h1 className="text-2xl md:text-3xl font-bold text-[#0A0A0A]">{product.name}</h1>
        <p className="text-3xl font-bold text-[#1B3A4B]">₦{product.price.toLocaleString()}</p>

        {variants.length > 0 && (
          <div>
            <h3 className="text-sm font-semibold mb-3">Available Colors</h3>
            <div className="flex flex-wrap gap-3">
              {variants.map((v: ProductVariant) => (
                <button key={v.id} onClick={() => setSelectedVariant(v)}
                  className={`w-10 h-10 rounded-full border-2 ${selectedVariant?.id === v.id ? 'border-[#1B3A4B] ring-2 ring-[#1B3A4B]/20' : v.quantity <= 0 ? 'border-red-300 opacity-40 cursor-not-allowed' : 'border-gray-200'}`}
                  style={{ backgroundColor: v.color_hex }} title={v.color_name} disabled={v.quantity <= 0} />
              ))}
            </div>
            {selectedVariant && <p className="text-xs text-[#6B7280] mt-2">{selectedVariant.color_name} {selectedVariant.quantity <= 3 && selectedVariant.quantity > 0 && <span className="text-orange-500">(Only {selectedVariant.quantity} left!)</span>}</p>}
          </div>
        )}

        {product.description && <div><h3 className="text-sm font-semibold mb-2">Description</h3><p className="text-[#6B7280]">{product.description}</p></div>}
        {product.sizes.length > 0 && <div><h3 className="text-sm font-semibold mb-3">Available Sizes</h3><div className="flex flex-wrap gap-2">{product.sizes.map((s: number) => <span key={s} className="px-4 py-2 border text-sm">{s}</span>)}</div></div>}
        <div>{availableStock <= 0 ? <p className="text-red-600 text-sm">✕ Out of Stock</p> : <p className="text-green-600 text-sm">✓ In Stock ({availableStock} available)</p>}</div>
        <AddToCartButton product={product} variant={selectedVariant} />
      </div>
    </div>
  )
}