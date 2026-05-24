'use client';

import { useState } from 'react';
import Image from 'next/image';
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';

export default function ProductImageGallery({ images, productName }: { images: string[]; productName: string }) {
  const [activeIndex, setActiveIndex] = useState(0);
  if (!images.length) return <div className="aspect-square bg-gray-100 flex items-center justify-center text-gray-400">No image</div>;

  return (
    <div className="space-y-4">
      <div className="aspect-square relative bg-gray-100">
        <Image src={images[activeIndex]} alt={`${productName} ${activeIndex+1}`} fill className="object-cover" sizes="(max-width: 768px) 100vw, 50vw" priority />
        {images.length > 1 && (
          <>
            <button onClick={() => setActiveIndex(p => p === 0 ? images.length-1 : p-1)} className="absolute left-3 top-1/2 -translate-y-1/2 bg-white/90 p-2 shadow-sm"><FiChevronLeft size={20} /></button>
            <button onClick={() => setActiveIndex(p => p === images.length-1 ? 0 : p+1)} className="absolute right-3 top-1/2 -translate-y-1/2 bg-white/90 p-2 shadow-sm"><FiChevronRight size={20} /></button>
            <div className="absolute bottom-3 right-3 bg-white/90 px-3 py-1 text-xs">{activeIndex+1}/{images.length}</div>
          </>
        )}
      </div>
      {images.length > 1 && (
        <div className="flex gap-2 overflow-x-auto pb-2">
          {images.map((img, i) => (
            <button key={i} onClick={() => setActiveIndex(i)} className={`relative w-20 h-20 flex-shrink-0 border-2 ${i === activeIndex ? 'border-[#1B3A4B]' : 'border-gray-200'}`}>
              <Image src={img} alt={`Thumb ${i+1}`} fill className="object-cover" sizes="80px" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}