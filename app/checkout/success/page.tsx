import Container from "@/components/Container"
import Link from "next/link"

export default function SuccessPage() {
  return (
    <main className="py-20 bg-white min-h-screen">
      <Container>
        <div className="max-w-md mx-auto text-center">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
          </div>
          <h1 className="text-2xl font-bold mb-4">Order Placed Successfully!</h1>
          <p className="text-[#6B7280] mb-8">Thank you for your order. We&apos;ll contact you shortly with delivery details.</p>
          <Link href="/products" className="inline-block bg-[#1B3A4B] text-white px-8 py-3 font-medium hover:bg-[#0A0A0A] transition">Continue Shopping</Link>
        </div>
      </Container>
    </main>
  )
}