'use client';

import { useField, useFormikContext } from 'formik';
import React from 'react';

interface FormArrayFieldProps {
  name: string;
  label?: string;
  placeholder?: string;
  helpText?: string;
  className?: string;
}

export const FormArrayField: React.FC<FormArrayFieldProps> = ({
  name,
  label,
  placeholder,
  helpText,
  className = '',
}) => {
  const [field, meta] = useField<string[]>(name);
  const { setFieldValue } = useFormikContext();
  const hasError = meta.touched && meta.error;

  const items = field.value || [];

  const addItem = () => {
    setFieldValue(name, [...items, '']);
  };

  const removeItem = (index: number) => {
    setFieldValue(
      name,
      items.filter((_, i) => i !== index)
    );
  };

  const updateItem = (index: number, value: string) => {
    const newItems = [...items];
    newItems[index] = value;
    setFieldValue(name, newItems);
  };

  return (
    <div className={`flex flex-col gap-2 ${className}`}>
      {label && (
        <label className="text-sm font-semibold text-neutral-200">
          {label}
        </label>
      )}

      <div className="space-y-2">
        {items.map((item, index) => (
          <div key={index} className="flex gap-2">
            <input
              type="text"
              value={item}
              onChange={(e) => updateItem(index, e.target.value)}
              placeholder={placeholder}
              className="flex-1 px-3 py-2 text-sm
                bg-[var(--admin-input-bg,#0c0f0d)] 
                border border-[var(--admin-border,#262a28)]
                text-[var(--admin-text-primary,#ffffff)]
                placeholder:text-neutral-500
                focus:outline-none focus:ring-2 focus:ring-[var(--admin-primary,#ccff00)] focus:ring-opacity-50
                transition-all"
            />
            <button
              type="button"
              onClick={() => removeItem(index)}
              className="px-3 py-2 text-xs font-bold uppercase
                bg-red-900/20 border border-red-800 text-red-300
                hover:bg-red-900/30 transition-all"
            >
              ✕
            </button>
          </div>
        ))}

        <button
          type="button"
          onClick={addItem}
          className="w-full px-4 py-2 text-xs font-bold uppercase tracking-wide
            bg-[var(--admin-surface,#0c0f0d)] 
            border border-dashed border-[var(--admin-border,#262a28)]
            text-neutral-400
            hover:border-[var(--admin-primary,#ccff00)] hover:text-neutral-200
            transition-all"
        >
          + Add Item
        </button>
      </div>

      {helpText && !hasError && (
        <span className="text-xs text-neutral-400">{helpText}</span>
      )}
      {hasError && typeof meta.error === 'string' && (
        <span className="text-xs text-red-400">{meta.error}</span>
      )}
    </div>
  );
};
