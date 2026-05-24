"use client"

import { useState, useEffect } from "react"
import Container from "@/components/Container"
import { useCart } from "@/context/CartContext"
import Link from "next/link"
import { Trash2, ShoppingBag, ArrowRight } from "lucide-react"

export default function CartPage() {
  const { items, removeItem, updateQuantity, totalPrice, clearCart, totalItems, getItemKey } = useCart()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  // Show nothing until client-side hydration to prevent mismatch
  if (!mounted) {
    return (
      <main className="py-20 bg-white min-h-screen">
        <Container>
          <div className="text-center py-20">
            <p className="text-[#6B7280]">Loading cart...</p>
          </div>
        </Container>
      </main>
    )
  }

  if (items.length === 0) {
    return (
      <main className="py-20 bg-white min-h-screen">
        <Container>
          <div className="max-w-2xl mx-auto text-center py-20">
            <ShoppingBag className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h1 className="text-3xl font-semibold mb-4">Your Cart is Empty</h1>
            <p className="text-[#6B7280] mb-8">Start shopping to add items to your cart.</p>
            <Link href="/products" className="bg-[#1B3A4B] text-white px-8 py-3 inline-block hover:bg-[#0A0A0A] transition">Browse Products</Link>
          </div>
        </Container>
      </main>
    )
  }

  return (
    <main className="py-12 md:py-20 bg-white min-h-screen">
      <Container>
        <h1 className="text-2xl md:text-3xl font-semibold mb-6 md:mb-8">Shopping Cart ({totalItems} items)</h1>

        {/* Mobile: Order Summary FIRST (above items) */}
        <div className="block lg:hidden mb-6">
          <div className="bg-[#F7F5F2] p-4 w-full overflow-hidden">
            <h2 className="text-lg font-bold mb-3 pb-2 border-b">Order Summary</h2>
            <div className="space-y-2 mb-3">
              {items.map((item) => (
                <div key={getItemKey(item.product.id, item.variant?.id ?? null, item.size)} className="flex justify-between text-sm gap-2">
                  <span className="truncate">{item.product.name} x{item.quantity}</span>
                  <span className="whitespace-nowrap flex-shrink-0">₦{(item.product.price * item.quantity).toLocaleString()}</span>
                </div>
              ))}
            </div>
            <div className="border-t pt-3 flex justify-between font-bold text-lg">
              <span>Total</span>
              <span className="text-[#1B3A4B]">₦{totalPrice.toLocaleString()}</span>
            </div>
            <Link href="/checkout" className="block w-full mt-4 bg-[#1B3A4B] text-white text-center py-3 font-semibold hover:bg-[#0A0A0A] transition text-sm">
              Checkout <ArrowRight className="w-4 h-4 inline ml-1" />
            </Link>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
{items.map((item) => {
  const key = getItemKey(item.product.id, item.variant?.id ?? null, item.size)
  const img = item.variant?.images?.[0] || item.product.images?.[0]
  return (
    <div key={key} className="bg-white border overflow-hidden">
      {/* Mobile: Stacked layout | Desktop: Horizontal layout */}
      <div className="flex flex-col sm:flex-row">
        {/* Image - Full width on mobile, fixed on desktop */}
        <div className="w-full sm:w-24 h-48 sm:h-24 bg-gray-100 flex-shrink-0">
          {img ? (
            <img src={img} alt={item.product.name} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs">No image</div>
          )}
        </div>
        
        {/* Details */}
        <div className="flex-1 min-w-0 p-4 flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-medium line-clamp-2">{item.product.name}</h3>
            {item.variant && <p className="text-xs text-[#6B7280] mt-1">Color: {item.variant.color_name}</p>}
            {item.size && <p className="text-xs text-[#6B7280]">Size: {item.size}</p>}
            <p className="text-sm font-semibold text-[#1B3A4B] mt-1">₦{item.product.price.toLocaleString()} each</p>
          </div>
          
          {/* Quantity + Total + Delete */}
          <div className="flex items-center justify-between mt-3 pt-3 border-t">
            <div className="flex items-center gap-2">
              <button onClick={() => updateQuantity(item.product.id, item.variant?.id ?? null, item.size, item.quantity - 1)} className="w-8 h-8 border rounded hover:bg-gray-100 text-lg leading-none">−</button>
              <span className="text-sm font-medium w-6 text-center">{item.quantity}</span>
              <button onClick={() => updateQuantity(item.product.id, item.variant?.id ?? null, item.size, item.quantity + 1)} className="w-8 h-8 border rounded hover:bg-gray-100 text-lg leading-none">+</button>
            </div>
            <div className="flex items-center gap-3">
              <p className="text-sm font-bold">₦{(item.product.price * item.quantity).toLocaleString()}</p>
              <button onClick={() => removeItem(item.product.id, item.variant?.id ?? null, item.size)} className="text-red-500 hover:text-red-700 p-1">
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
})}

            <div className="flex justify-end mt-4">
              <button onClick={clearCart} className="text-sm text-gray-500 hover:text-red-500 flex items-center gap-1"><Trash2 className="w-4 h-4" /> Clear Cart</button>
            </div>
          </div>

          {/* Desktop Order Summary */}
          <div className="hidden lg:block lg:col-span-1">
            <div className="bg-[#F7F5F2] p-6 sticky top-24">
              <h2 className="text-xl font-bold mb-4 pb-4 border-b">Order Summary</h2>
              <div className="space-y-3 mb-4 max-h-80 overflow-y-auto">
                {items.map((item) => (
                  <div key={getItemKey(item.product.id, item.variant?.id ?? null, item.size)} className="flex justify-between text-sm gap-2">
                    <span className="truncate">{item.product.name} x{item.quantity}</span>
                    <span className="whitespace-nowrap flex-shrink-0">₦{(item.product.price * item.quantity).toLocaleString()}</span>
                  </div>
                ))}
              </div>
              <div className="border-t pt-4 flex justify-between font-bold text-lg">
                <span>Total</span>
                <span className="text-[#1B3A4B]">₦{totalPrice.toLocaleString()}</span>
              </div>
              <Link href="/checkout" className="block w-full mt-6 bg-[#1B3A4B] text-white text-center py-4 font-semibold hover:bg-[#0A0A0A] transition">
                Proceed to Checkout <ArrowRight className="w-5 h-5 inline ml-1" />
              </Link>
              <Link href="/products" className="block text-center text-sm text-[#6B7280] mt-4 hover:text-[#1B3A4B]">← Continue Shopping</Link>
            </div>
          </div>
        </div>
      </Container>
    </main>
  )
}