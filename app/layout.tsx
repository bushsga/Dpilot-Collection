import "./globals.css"
import Navbar from "@/components/Navbar"
import Footer from "@/components/Footer"
import { CartProvider } from "@/context/CartContext"
import { AuthProvider } from "@/context/AuthContext"
import { Toaster } from 'react-hot-toast'
import type { Metadata } from "next"
import WhatsAppButton from "@/components/WhatsAppButton"
import Script from "next/script"

export const metadata: Metadata = {
  title: {
    default: "DPiLOT COLLECTION - Premium Footwear",
    template: "%s | DPiLOT COLLECTION"
  },
  description: "Original quality footwear, fully boxed and equipped. Step into authenticity.",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="font-sans">
        <AuthProvider>
          <CartProvider>
            <Navbar />
            <div className="pt-[73px]">
              <Toaster position="top-right" />
              {children}
            </div>
            <Footer />
            <WhatsAppButton />
          </CartProvider>
        </AuthProvider>

        <Script
          src="https://js.paystack.co/v2/inline.js"
          strategy="beforeInteractive"
        />
        <Script
  src="https://upload-widget.cloudinary.com/global/all.js"
  strategy="beforeInteractive"
/>
      </body>
    </html>
  )
}