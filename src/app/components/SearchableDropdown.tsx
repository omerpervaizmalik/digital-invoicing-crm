'use client';

import React, { useState, useEffect, useRef } from 'react';
import { searchHsCodes } from '../actions';

interface HsCode {
  code: string;
  description: string;
  raw: string;
}

interface SearchableDropdownProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

export default function SearchableDropdown({ value, onChange, placeholder = 'Search HS Code...', className = '' }: SearchableDropdownProps) {
  const [query, setQuery] = useState(value);
  const [results, setResults] = useState<HsCode[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setQuery(value);
  }, [value]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearch = async (text: string) => {
    setQuery(text);
    onChange(text); // allow raw text to be the value if they don't click anything

    if (text.length >= 2) {
      setLoading(true);
      setIsOpen(true);
      const matches = await searchHsCodes(text);
      setResults(matches);
      setLoading(false);
    } else {
      setResults([]);
      setIsOpen(false);
    }
  };

  const handleSelect = (hs: HsCode) => {
    setQuery(hs.code);
    onChange(hs.code);
    setIsOpen(false);
  };

  return (
    <div className={`relative ${className}`} ref={wrapperRef}>
      <input
        type="text"
        value={query}
        onChange={(e) => handleSearch(e.target.value)}
        onFocus={() => {
          if (results.length > 0) setIsOpen(true);
        }}
        placeholder={placeholder}
        className="w-full bg-neutral-800 border border-neutral-700 rounded-lg px-4 py-2.5 text-neutral-200 focus:ring-2 focus:ring-emerald-500 focus:outline-none transition-all"
      />
      
      {isOpen && (
        <div className="absolute z-50 w-full mt-1 bg-neutral-800 border border-neutral-700 rounded-lg shadow-xl max-h-60 overflow-y-auto">
          {loading ? (
            <div className="p-4 text-center text-sm text-neutral-400">Searching...</div>
          ) : results.length > 0 ? (
            <ul className="py-1">
              {results.map((hs) => (
                <li
                  key={hs.code}
                  onClick={() => handleSelect(hs)}
                  className="px-4 py-2 hover:bg-neutral-700 cursor-pointer transition-colors"
                >
                  <div className="font-mono font-medium text-emerald-400">{hs.code}</div>
                  <div className="text-sm text-neutral-400 truncate">{hs.description}</div>
                </li>
              ))}
            </ul>
          ) : (
            <div className="p-4 text-center text-sm text-neutral-400">No HS Codes found.</div>
          )}
        </div>
      )}
    </div>
  );
}
