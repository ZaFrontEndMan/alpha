'use client';

import { useField } from 'formik';
import React, { useState, useEffect } from 'react';
import { useDebounce } from 'use-debounce';

interface FormInputProps {
  name: string;
  label?: string;
  type?: string;
  placeholder?: string;
  helpText?: string;
  disabled?: boolean;
  className?: string;
  debounceMs?: number;
}

export const FormInput: React.FC<FormInputProps> = ({
  name,
  label,
  type = 'text',
  placeholder,
  helpText,
  disabled = false,
  className = '',
  debounceMs = 300,
}) => {
  const [field, meta, helpers] = useField(name);
  const [localValue, setLocalValue] = useState(field.value || '');
  const [debouncedValue] = useDebounce(localValue, debounceMs);
  const hasError = meta.touched && meta.error;

  // Sync local value with field value on mount/external changes
  useEffect(() => {
    setLocalValue(field.value || '');
  }, [field.value]);

  // Update Formik when debounced value changes
  useEffect(() => {
    if (debouncedValue !== field.value) {
      helpers.setValue(debouncedValue);
    }
  }, [debouncedValue]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLocalValue(e.target.value);
  };

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
      <input
        id={name}
        type={type}
        disabled={disabled}
        placeholder={placeholder}
        value={localValue}
        onChange={handleChange}
        onBlur={field.onBlur}
        name={field.name}
        className={`
          w-full px-3 py-2 text-sm
          bg-[var(--admin-input-bg,#0c0f0d)] 
          border border-[var(--admin-border,#262a28)]
          text-[var(--admin-text-primary,#ffffff)]
          placeholder:text-neutral-500
          focus:outline-none focus:ring-2 focus:ring-[var(--admin-primary,#ccff00)] focus:ring-opacity-50
          disabled:opacity-50 disabled:cursor-not-allowed
          transition-all
          ${hasError ? 'border-red-500' : ''}
        `}
      />
      {helpText && !hasError && (
        <span className="text-xs text-neutral-400">{helpText}</span>
      )}
      {hasError && (
        <span className="text-xs text-red-400">{meta.error}</span>
      )}
    </div>
  );
};
