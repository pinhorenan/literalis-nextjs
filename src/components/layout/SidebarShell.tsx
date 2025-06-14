// src/components/layout/SidebarShell.tsx
'use client';

import clsx from 'clsx';
import { ReactNode } from 'react';

interface SidebarShellProps {
    position: 'left' | 'right';
    bg?: boolean;
    border?: boolean;
    children: ReactNode;
}

export function SidebarShell({ position, bg = true, border = true, children }: SidebarShellProps) {
    return (
        <aside className="relative flex-shrink-0 w-[var(--size-sidebar)]">
            <div
                className={clsx(
                    'fixed top-0 w-[var(--size-sidebar)] h-full overflow-auto p-4 space-y-2',
                    bg ? 'bg-[var(--surface-bg)]' : 'bg-transparent',
                    border ? 'border-[var(--border-base)]' : 'border-none', 
                    position === 'left' ? 'left-0  border-r ' : 'right-0 border-l '
                )}
            >
                {children}
            </div>
        </aside>
    );
}