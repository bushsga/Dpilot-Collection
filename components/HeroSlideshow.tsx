"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Container from "./Container"
import Link from "next/link"

const slides = [
  { image: "/images/slide-1.jpg", alt: "DPiLOT Collection" },
  { image: "/images/slide-2.jpg", alt: "DPiLOT Collection" },
  { image: "/images/slide-3.jpg", alt: "DPiLOT Collection" },
  { image: "/images/slide-4.jpg", alt: "DPiLOT Collection" },
]

export default function HeroSlideshow() {
  const [currentSlide, setCurrentSlide] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length)
    }, 4000)
    return () => clearInterval(timer)
  }, [])

  return (
    <section className="bg-[#F7F5F2] py-12 md:py-20 overflow-hidden">
      <Container>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          {/* Text Column */}
          <div className="order-2 md:order-1 text-center md:text-left">
            <h1 className="text-4xl md:text-6xl font-bold text-[#0A0A0A] mb-4">
              DPiLOT <span className="text-[#1B3A4B]">COLLECTION</span>
            </h1>
            <p className="text-[#6B7280] text-lg max-w-md mx-auto md:mx-0 mb-8">
              Premium footwear, fully boxed and equipped. Step into authenticity.
            </p>
            <Link href="/products" className="inline-block bg-[#1B3A4B] text-white px-8 py-4 font-medium text-sm hover:bg-[#0A0A0A] transition-colors">
              Shop Collection
            </Link>
          </div>

          {/* Slider Column */}
          <div className="order-1 md:order-2 relative aspect-[4/3] overflow-hidden rounded-sm">
            {slides.map((slide, index) => (
              <div key={index} className={`absolute inset-0 transition-opacity duration-700 ${index === currentSlide ? "opacity-100" : "opacity-0"}`}>
                <Image src={slide.image} alt={slide.alt} fill className="object-cover" priority={index === 0} sizes="(max-width: 768px) 100vw, 50vw" />
              </div>
            ))}
            {/* Dots */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-10">
              {slides.map((_, index) => (
                <button key={index} onClick={() => setCurrentSlide(index)} className={`w-2 h-2 rounded-full transition-colors ${index === currentSlide ? "bg-[#1B3A4B]" : "bg-[#6B7280]/30"}`} />
              ))}
            </div>
          </div>
        </div>
      </Container>
    </section>
  )
}