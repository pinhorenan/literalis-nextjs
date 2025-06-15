// File: src/components/ui/SearchBar.tsx
'use client';

import React from 'react';
import { Search } from 'lucide-react';

export interface SearchBarProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange'> {
    className?: string;
    onChange: (value: string) => void;
}

export default function SearchBar({
    className = '',
    onChange,
    value,
    placeholder,
    ...rest
}: SearchBarProps) {
    return (
        <div
            className={`flex items-center gap-2 bg-[var(--surface-input)] border border-[var(--border-base)] rounded-[var(--radius-md)] px-3 py-1 ${className}`}
        >
            <Search className="w-4 h-4 text-[var(--text-tertiary)]" />
            <input
                type="text"
                value={value}
                placeholder={placeholder}
                onChange={e => onChange(e.target.value)}
                className="flex-1 bg-transparent focus:outline-none text-sm text-[var(--text-primary)] placeholder-[var(--text-tertiary)]"
                {...rest}
            />
        </div>
    );
}