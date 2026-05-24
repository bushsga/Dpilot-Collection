"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import type { Product } from "@/types"

export default function ProductCard({ product }: { product: Product }) {
  const totalStock = product.quantity
  const images = product.images && product.images.length > 0 ? product.images : []
  const [currentImg, setCurrentImg] = useState(0)

  // Auto-slide images
  useEffect(() => {
    if (images.length <= 1) return
    const timer = setInterval(() => {
      setCurrentImg(prev => (prev + 1) % images.length)
    }, 3000)
    return () => clearInterval(timer)
  }, [images.length])

  return (
    <Link href={`/products/${product.id}`} className="group bg-white shadow-sm hover:shadow-md transition-shadow block">
      <div className="aspect-square relative overflow-hidden bg-gray-100">
        {images.length > 0 ? (
          <>
            {/* Current Image */}
            <img
              src={images[currentImg]}
              alt={product.name}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
            {/* Dots Indicator */}
            {images.length > 1 && (
              <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5 z-10">
                {images.map((_, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={(e) => {
                      e.preventDefault()
                      e.stopPropagation()
                      setCurrentImg(idx)
                    }}
                    className={`w-2 h-2 rounded-full transition-colors ${
                      idx === currentImg ? 'bg-[#1B3A4B]' : 'bg-white/70'
                    }`}
                  />
                ))}
              </div>
            )}
          </>
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-400 text-sm">No Image</div>
        )}
        
        {/* Price Tag */}
        <div className="absolute top-3 left-3 bg-[#0A0A0A] text-white text-xs px-3 py-1 z-10">
          ₦{product.price.toLocaleString()}
        </div>
        
        {/* Stock Badge */}
        {totalStock <= 0 && (
          <div className="absolute top-3 right-3 bg-red-500 text-white text-xs px-2 py-1 z-10">Sold Out</div>
        )}
        {totalStock > 0 && totalStock <= 3 && (
          <div className="absolute top-3 right-3 bg-orange-500 text-white text-xs px-2 py-1 z-10">Only {totalStock} left</div>
        )}
      </div>
      
      {/* Product Info */}
      <div className="p-4">
        <h3 className="text-sm font-medium text-[#0A0A0A] line-clamp-2 mb-1 group-hover:text-[#1B3A4B] transition-colors">
          {product.name}
        </h3>
        {product.sizes && product.sizes.length > 0 && (
          <p className="text-xs text-[#6B7280]">Sizes: {product.sizes.join(', ')}</p>
        )}
        {totalStock > 3 && <p className="text-xs text-green-600 mt-1">In Stock</p>}
        {totalStock > 0 && totalStock <= 3 && <p className="text-xs text-orange-500 mt-1">Low Stock</p>}
        {totalStock <= 0 && <p className="text-xs text-red-500 mt-1">Out of Stock</p>}
      </div>
    </Link>
  )
}