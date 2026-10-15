'use client';

import React from 'react';

interface FormRowProps {
  children: React.ReactNode;
  columns?: 1 | 2;
  className?: string;
}

export const FormRow: React.FC<FormRowProps> = ({ 
  children, 
  columns = 2,
  className = '' 
}) => {
  return (
    <div className={`grid gap-4 ${columns === 2 ? 'grid-cols-1 md:grid-cols-2' : 'grid-cols-1'} ${className}`}>
      {children}
    </div>
  );
};
