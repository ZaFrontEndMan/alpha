'use client';

import { useField, useFormikContext } from 'formik';
import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Plus, Trash2, Upload } from 'lucide-react';

interface FormImageSliderProps {
  name: string;
  label?: string;
  helpText?: string;
  maxImages?: number;
  className?: string;
}

export const FormImageSlider: React.FC<FormImageSliderProps> = ({
  name,
  label,
  helpText,
  maxImages = 10,
  className = '',
}) => {
  const [field, meta] = useField<string[]>(name);
  const { setFieldValue } = useFormikContext();
  const [isUploading, setIsUploading] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  
  const images = field.value || [];
  const hasError = meta.touched && meta.error;

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) throw new Error('Upload failed');

      const data = await response.json();
      const newImages = [...images, data.url];
      setFieldValue(name, newImages);
      setCurrentIndex(newImages.length - 1);
    } catch (error) {
      console.error('Upload error:', error);
      alert('Failed to upload image');
    } finally {
      setIsUploading(false);
      e.target.value = '';
    }
  };

  const removeImage = (index: number) => {
    const newImages = images.filter((_, i) => i !== index);
    setFieldValue(name, newImages);
    if (currentIndex >= newImages.length && newImages.length > 0) {
      setCurrentIndex(newImages.length - 1);
    } else if (newImages.length === 0) {
      setCurrentIndex(0);
    }
  };

  const goToPrevious = () => {
    setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const goToNext = () => {
    setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  return (
    <div className={`flex flex-col gap-3 ${className}`}>
      {label && (
        <label className="text-sm font-semibold text-neutral-200">
          {label}
        </label>
      )}

      {/* Image Slider */}
      {images.length > 0 ? (
        <div className="relative">
          {/* Main Image Display */}
          <div className="relative aspect-video bg-neutral-900 border border-[var(--admin-border,#262a28)] overflow-hidden">
            <img
              src={images[currentIndex]}
              alt={`Slide ${currentIndex + 1}`}
              className="w-full h-full object-cover transition-opacity duration-300"
            />
            
            {/* Navigation Arrows */}
            {images.length > 1 && (
              <>
                <button
                  type="button"
                  onClick={goToPrevious}
                  className="absolute left-2 top-1/2 -translate-y-1/2 w-10 h-10
                    bg-black/60 hover:bg-black/80 border border-white/20
                    flex items-center justify-center transition-all cursor-pointer"
                >
                  <ChevronLeft className="w-6 h-6 text-white" />
                </button>
                <button
                  type="button"
                  onClick={goToNext}
                  className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10
                    bg-black/60 hover:bg-black/80 border border-white/20
                    flex items-center justify-center transition-all cursor-pointer"
                >
                  <ChevronRight className="w-6 h-6 text-white" />
                </button>
              </>
            )}

            {/* Delete Current Image */}
            <button
              type="button"
              onClick={() => removeImage(currentIndex)}
              className="absolute top-2 right-2 w-9 h-9
                bg-red-600/80 hover:bg-red-600
                flex items-center justify-center transition-all cursor-pointer"
            >
              <Trash2 className="w-4 h-4 text-white" />
            </button>

            {/* Image Counter */}
            <div className="absolute bottom-2 left-1/2 -translate-x-1/2
              px-3 py-1 bg-black/60 text-white text-xs font-mono">
              {currentIndex + 1} / {images.length}
            </div>
          </div>

          {/* Thumbnail Strip */}
          {images.length > 1 && (
            <div className="flex gap-2 mt-2 overflow-x-auto pb-2">
              {images.map((img, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setCurrentIndex(idx)}
                  className={`
                    shrink-0 w-16 h-16 border-2 transition-all cursor-pointer
                    ${idx === currentIndex 
                      ? 'border-[var(--admin-primary,#ccff00)]' 
                      : 'border-neutral-700 hover:border-neutral-500'
                    }
                  `}
                >
                  <img
                    src={img}
                    alt={`Thumbnail ${idx + 1}`}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </div>
      ) : (
        <div className="aspect-video bg-neutral-900/50 border-2 border-dashed border-neutral-700
          flex items-center justify-center">
          <div className="text-center text-neutral-400">
            <Upload className="w-12 h-12 mx-auto mb-2 opacity-50" />
            <p className="text-sm">No images uploaded</p>
          </div>
        </div>
      )}

      {/* Upload Button */}
      {images.length < maxImages && (
        <div>
          <input
            type="file"
            accept="image/*"
            onChange={handleFileUpload}
            disabled={isUploading}
            className="hidden"
            id={`${name}-upload`}
          />
          <label
            htmlFor={`${name}-upload`}
            className={`
              inline-flex items-center gap-2 px-4 py-2 text-xs font-bold uppercase tracking-wide
              bg-[var(--admin-surface,#0c0f0d)] 
              border border-[var(--admin-border,#262a28)]
              text-neutral-200
              hover:border-[var(--admin-primary,#ccff00)]
              ${isUploading ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
              transition-all
            `}
          >
            <Plus className="w-4 h-4" />
            {isUploading ? 'Uploading...' : `Add Image (${images.length}/${maxImages})`}
          </label>
        </div>
      )}

      {helpText && !hasError && (
        <span className="text-xs text-neutral-400">{helpText}</span>
      )}
      {hasError && typeof meta.error === 'string' && (
        <span className="text-xs text-red-400">{meta.error}</span>
      )}
    </div>
  );
};
