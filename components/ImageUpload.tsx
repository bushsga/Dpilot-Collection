'use client';

import { useRef, useState } from 'react';
import { FiUpload, FiX, FiLoader } from 'react-icons/fi';
import Image from 'next/image';

interface ImageUploadProps {
  images: string[];
  onChange: (images: string[]) => void;
  maxImages?: number;
}

export default function ImageUpload({ images, onChange, maxImages = 5 }: ImageUploadProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploading(true);
    const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
    const uploadPreset = 'dpilot-products';

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      
      if (file.size > 10000000) {
        alert(`${file.name} is too large. Max 10MB.`);
        continue;
      }

      const formData = new FormData();
      formData.append('file', file);
      formData.append('upload_preset', uploadPreset);

      try {
        const res = await fetch(
          `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
          { method: 'POST', body: formData }
        );
        const data = await res.json();
        if (data.secure_url) {
          onChange([...images, data.secure_url]);
        } else {
          alert('Upload failed: ' + (data.error?.message || 'Unknown error'));
        }
      } catch (err) {
        alert('Upload failed. Check your connection.');
      }
    }
    
    setUploading(false);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const removeImage = (index: number) => {
    onChange(images.filter((_, i) => i !== index));
  };

  return (
    <div>
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        multiple
        onChange={handleFileUpload}
        className="hidden"
      />
      
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
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          disabled={uploading}
          className="flex items-center gap-2 border-2 border-dashed border-gray-300 px-6 py-4 text-sm text-gray-500 hover:border-[#1B3A4B] hover:text-[#1B3A4B] transition-colors disabled:opacity-50"
        >
          {uploading ? (
            <>
              <FiLoader className="animate-spin" />
              Uploading...
            </>
          ) : (
            <>
              <FiUpload />
              Upload Images ({images.length}/{maxImages})
            </>
          )}
        </button>
      )}
    </div>
  );
}