'use client';

import { useField } from 'formik';
import React from 'react';

interface FormColorPickerProps {
  name: string;
  label?: string;
  helpText?: string;
  className?: string;
}

export const FormColorPicker: React.FC<FormColorPickerProps> = ({
  name,
  label,
  helpText,
  className = '',
}) => {
  const [field, meta] = useField(name);
  const hasError = meta.touched && meta.error;

  return (
    <div className={`flex flex-col gap-1.5 ${className}`}>
      {label && (
        <label
          htmlFor={name}
          className="text-sm font-semibold text-neutral-200"
        >
          {label}
        </label>
      )}

      <div className="flex items-center gap-3">
        {/* Color preview */}
        <div
          className="w-12 h-12 border-2 border-[var(--admin-border,#262a28)]"
          style={{ backgroundColor: field.value }}
        />

        {/* Color input */}
        <div className="flex-1 flex gap-2">
          <input
            id={name}
            type="color"
            {...field}
            className="w-16 h-12 cursor-pointer border border-[var(--admin-border,#262a28)]"
          />
          <input
            type="text"
            value={field.value}
            onChange={(e) => field.onChange({ target: { name: field.name, value: e.target.value } })}
            placeholder="#000000"
            className="flex-1 px-3 py-2 text-sm font-mono
              bg-[var(--admin-input-bg,#0c0f0d)] 
              border border-[var(--admin-border,#262a28)]
              text-[var(--admin-text-primary,#ffffff)]
              placeholder:text-neutral-500
              focus:outline-none focus:ring-2 focus:ring-[var(--admin-primary,#ccff00)] focus:ring-opacity-50
              transition-all"
          />
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
