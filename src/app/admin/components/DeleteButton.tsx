'use client';

import React from 'react';

export function DeleteButton({ 
  label, 
  confirmMessage, 
  className = "text-red-500 font-bold hover:underline text-xs" 
}: { 
  label: string, 
  confirmMessage: string, 
  className?: string 
}) {
  return (
    <button 
      type="submit" 
      className={className} 
      onClick={(e) => { 
        if (!window.confirm(confirmMessage)) {
          e.preventDefault();
        }
      }}
    >
      {label}
    </button>
  );
}
