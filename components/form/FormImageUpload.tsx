'use client';

import { useField, useFormikContext } from 'formik';
import React, { useState, useRef } from 'react';

interface FormImageUploadProps {
  name: string;
  label?: string;
  helpText?: string;
  className?: string;
}

export const FormImageUpload: React.FC<FormImageUploadProps> = ({
  name,
  label,
  helpText,
  className = '',
}) => {
  const [field, meta] = useField(name);
  const { setFieldValue } = useFormikContext();
  const [isUploading, setIsUploading] = useState(false);
  const [preview, setPreview] = useState<string>(field.value || '');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const hasError = meta.touched && meta.error;

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Show preview immediately
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreview(reader.result as string);
    };
    reader.readAsDataURL(file);

    // Upload to server
    setIsUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Upload failed');
      }

      const data = await response.json();
      setFieldValue(name, data.url);
    } catch (error) {
      console.error('Upload error:', error);
      alert('Failed to upload image. Please try again.');
      setPreview(field.value || '');
    } finally {
      setIsUploading(false);
    }
  };

  const handleRemove = () => {
    setFieldValue(name, '');
    setPreview('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className={`flex flex-col gap-2 ${className}`}>
      {label && (
        <label className="text-sm font-semibold text-neutral-200">
          {label}
        </label>
      )}

      <div className="flex items-start gap-3">
        {/* Preview */}
        {preview && (
          <div className="relative w-24 h-24 border border-[var(--admin-border,#262a28)] bg-neutral-900 overflow-hidden shrink-0">
            <img
              src={preview}
              alt="Preview"
              className="w-full h-full object-cover"
            />
          </div>
        )}

        {/* Upload Controls */}
        <div className="flex-1 flex flex-col gap-2">
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            disabled={isUploading}
            className="hidden"
            id={`${name}-file-input`}
          />

          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={isUploading}
              className="px-4 py-2 text-xs font-bold uppercase tracking-wide
                bg-[var(--admin-surface,#0c0f0d)] 
                border border-[var(--admin-border,#262a28)]
                text-neutral-200
                hover:border-[var(--admin-primary,#ccff00)]
                disabled:opacity-50 disabled:cursor-not-allowed
                transition-all"
            >
              {isUploading ? 'Uploading...' : preview ? 'Change Image' : 'Upload Image'}
            </button>

            {preview && (
              <button
                type="button"
                onClick={handleRemove}
                disabled={isUploading}
                className="px-4 py-2 text-xs font-bold uppercase tracking-wide
                  bg-red-900/20 
                  border border-red-800
                  text-red-300
                  hover:bg-red-900/30
                  disabled:opacity-50 disabled:cursor-not-allowed
                  transition-all"
              >
                Remove
              </button>
            )}
          </div>

          {field.value && !preview && (
            <div className="text-xs text-neutral-400">
              Current: {field.value}
            </div>
          )}
        </div>
      </div>

      {helpText && !hasError && (
        <span className="text-xs text-neutral-400">{helpText}</span>
      )}
      {hasError && (
        <span className="text-xs text-red-400">{meta.error}</span>
      )}
    </div>
  );
};
