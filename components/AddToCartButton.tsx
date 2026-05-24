"use client"

import { useState } from "react"
import { useCart } from "@/context/CartContext"
import type { Product, ProductVariant } from "@/types"

export default function AddToCartButton({ product, variant }: { product: Product; variant?: ProductVariant | null }) {
  const [selectedSize, setSelectedSize] = useState<number | null>(null)
  const [added, setAdded] = useState(false)
  const { addItem } = useCart()
  const availableStock = variant ? variant.quantity : product.quantity;
  const isOutOfStock = availableStock <= 0;

  const handleAdd = () => {
    if (product.sizes.length > 0 && !selectedSize) { alert('Please select a size'); return; }
    if (isOutOfStock) { alert('Out of stock'); return; }
    addItem(product, variant || null, selectedSize);
    setAdded(true); setTimeout(() => setAdded(false), 2000);
  };

  return (
    <div className="space-y-4 pt-4 border-t">
      {product.sizes.length > 0 && (
        <div className="space-y-2">
          <label className="text-sm font-semibold">Select Size:</label>
          <div className="flex flex-wrap gap-2">
            {product.sizes.map((size: number) => (
              <button key={size} type="button" onClick={() => setSelectedSize(size)} className={`px-4 py-2 text-sm border ${selectedSize === size ? 'border-[#1B3A4B] bg-[#1B3A4B] text-white' : 'border-gray-200 hover:border-[#1B3A4B]'}`}>{size}</button>
            ))}
          </div>
        </div>
      )}
      <button onClick={handleAdd} disabled={isOutOfStock} className={`w-full py-4 text-sm font-medium ${isOutOfStock ? 'bg-gray-200 text-gray-400 cursor-not-allowed' : added ? 'bg-green-600 text-white' : 'bg-[#1B3A4B] text-white hover:bg-[#0A0A0A]'} transition-colors`}>
        {isOutOfStock ? 'Out of Stock' : added ? '✓ Added to Cart!' : 'Add to Cart'}
      </button>
      {!isOutOfStock && availableStock <= 3 && <p className="text-xs text-orange-500 text-center">Only {availableStock} left!</p>}
    </div>
  );
}