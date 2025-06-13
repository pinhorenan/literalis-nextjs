// components/ui/SearchBar.tsx

'use client';

import React from 'react';
import { Search } from 'lucide-react';

export interface SearchBarProps extends React.InputHTMLAttributes<HTMLInputElement> {
    className?: string;
}

export function SearchBar({ className = '', ...props }: SearchBarProps) {
    return (
        <div
            className={`flex items-center gap-2 bg-[var(--surface-input)] border border-[var(--border-base)] rounded-[var(--radius-md)] px-3 py-1 ${className}`}
        >
            <Search className="w-4 h-4 text-[var(--text-tertiary)]" />
            <input
                type="text"
                className="flex-1 bg-transparent focus:outline-none text-sm text-[var(--text-primary)] placeholder-[var(--text-tertiary)]"
                {...props}
            />
        </div>
    );
}