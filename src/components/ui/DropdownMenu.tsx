// components/ui/DropdownMenu.tsx
'use client';
import React, { useState, useRef } from 'react';
import clsx from 'clsx';
import useClickOutside from '@/src/hooks/useClickOutside';

interface DropdownProps {
  /** Elemento que dispara o menu (avatar, ícone, botão, etc.) */
  trigger: React.ReactNode;
  /** Itens (texto + callback) */
  items: { label: string; onClick: () => void }[];
  align?: 'left' | 'right';
  width?: number;       // largura opcional (px) – default 200
}

export default function DropdownMenu({
  trigger,
  items,
  align = 'right',
  width = 200,
}: DropdownProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  useClickOutside(ref, () => setOpen(false));

  return (
    <div ref={ref} className="relative">
      <div onClick={() => setOpen(v => !v)}>{trigger}</div>

      {open && (
        <div
          role="menu"
          style={{ width }}
          className={clsx(
            'absolute z-50 mt-2 rounded-[var(--radius-md)] shadow-lg ring-1 ring-black/10',
            'bg-[var(--color-offwhite)] text-[var(--color-olive)]',
            'dark:bg-[var(--color-olive-light)] dark:text-[var(--color-offwhite)]',
            align === 'right' ? 'right-0' : 'left-0',
          )}
        >
          {items.map(({ label, onClick }) => (
            <button
              key={label}
              role="menuitem"
              onClick={() => {
                onClick();
                setOpen(false);
              }}
              className="block w-full px-4 py-2 text-sm text-left hover:bg-[var(--color-olive)] transition-colors"
            >
              {label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
