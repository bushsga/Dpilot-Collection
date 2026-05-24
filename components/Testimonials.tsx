"use client"

import Container from "./Container"
import { Star } from "lucide-react"

const testimonials = [
  { name: "Amina", role: "Lagos", content: "Best quality shoes! Fast delivery too.", rating: 5 },
  { name: "Chidi", role: "Abuja", content: "My Timbs came fully boxed and perfect.", rating: 5 },
  { name: "Fola", role: "Ibadan", content: "Original LV sneakers – I'm impressed.", rating: 5 },
  { name: "Tunde", role: "Port Harcourt", content: "Great customer service. Will buy again!", rating: 5 },
  { name: "Ngozi", role: "Kano", content: "The slides are so comfortable. Thank you!", rating: 5 },
  { name: "Emeka", role: "Enugu", content: "Luxury shoes at a fair price. Highly recommended.", rating: 5 },
]

export default function Testimonials() {
  return (
    <section className="py-20 bg-white overflow-hidden">
      <Container>
        <div className="text-center mb-12">
          <h2 className="text-2xl sm:text-3xl font-semibold">What Our Customers Say</h2>
          <p className="text-gray-600 mt-3 max-w-xl mx-auto">Trusted by shoe lovers across Nigeria</p>
        </div>

        <style jsx>{`
          @keyframes testimonialScroll {
            0% { transform: translate3d(0, 0, 0); }
            100% { transform: translate3d(-50%, 0, 0); }
          }
          .testimonial-track {
            display: flex;
            width: max-content;
            animation: testimonialScroll 25s linear infinite;
          }
          .testimonial-track:hover {
            animation-play-state: paused;
          }
        `}</style>

        <div className="relative">
          <div className="testimonial-track">
            {[...testimonials, ...testimonials].map((t, idx) => (
              <div key={idx} className="w-[300px] sm:w-[340px] flex-shrink-0 mx-3 bg-[#F7F5F2] border border-gray-100 p-6">
                <div className="flex gap-1 mb-3">
                  {[...Array(t.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-[#1B3A4B] text-[#1B3A4B]" />
                  ))}
                </div>
                <p className="text-gray-600 text-sm mb-4 italic">"{t.content}"</p>
                <h4 className="font-medium text-sm">{t.name}</h4>
                <p className="text-xs text-gray-500">{t.role}</p>
              </div>
            ))}
          </div>
        </div>
      </Container>
    </section>
  )
}