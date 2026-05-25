'use client';

import { useCallback } from 'react';
import { FiUpload, FiX } from 'react-icons/fi';
import Image from 'next/image';

interface ImageUploadProps {
  images: string[];
  onChange: (images: string[]) => void;
  maxImages?: number;
}

export default function ImageUpload({ images, onChange, maxImages = 5 }: ImageUploadProps) {
  
  const openWidget = useCallback(() => {
    (window as any).cloudinary.createUploadWidget(
      {
        cloudName: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
        uploadPreset: 'dpilot-products',
        maxFiles: maxImages - images.length,
        multiple: true,
        sources: ['local', 'url', 'camera'],
        styles: {
          palette: {
            window: '#FFFFFF',
            windowBorder: '#1B3A4B',
            tabIcon: '#1B3A4B',
            textDark: '#0A0A0A',
            textLight: '#FFFFFF',
            link: '#1B3A4B',
            action: '#1B3A4B',
            inProgress: '#1B3A4B',
            complete: '#0A0A0A',
            error: '#CC0000',
          },
        },
      },
      (error: any, result: any) => {
        if (!error && result && result.event === 'success') {
          onChange([...images, result.info.secure_url]);
        }
        if (error) {
          console.error('Upload error:', error);
        }
      }
    ).open();
  }, [images, onChange, maxImages]);

  const handleUpload = useCallback(() => {
    if (!(window as any).cloudinary) {
      // Wait and retry instead of showing error immediately
      let attempts = 0;
      const checkCloudinary = setInterval(() => {
        attempts++;
        if ((window as any).cloudinary) {
          clearInterval(checkCloudinary);
          openWidget();
        } else if (attempts > 30) {
          clearInterval(checkCloudinary);
          alert('Image uploader is taking too long. Please refresh the page and try again.');
        }
      }, 500);
      return;
    }
    openWidget();
  }, [openWidget]);

  const removeImage = (index: number) => {
    const newImages = images.filter((_, i) => i !== index);
    onChange(newImages);
  };

  return (
    <div>
      {images.length > 0 && (
        <div className="flex flex-wrap gap-4 mb-4">
          {images.map((img, i) => (
            <div key={i} className="relative w-24 h-24 border">
              <Image src={img} alt={`Upload ${i + 1}`} fill className="object-cover" sizes="96px" />
              <button type="button" onClick={() => removeImage(i)} className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center">
                <FiX size={12} />
              </button>
            </div>
          ))}
        </div>
      )}
      {images.length < maxImages && (
        <button type="button" onClick={handleUpload} className="flex items-center gap-2 border-2 border-dashed border-gray-300 px-6 py-4 text-sm text-gray-500 hover:border-[#1B3A4B] hover:text-[#1B3A4B] transition-colors">
          <FiUpload /> Upload Images ({images.length}/{maxImages})
        </button>
      )}
    </div>
  );
}