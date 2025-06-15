// File: src/components/ui/OptionsMenu.tsx
'use client';

import { useState, useRef } from 'react';
import { MoreVertical }     from 'lucide-react';
import { Button }           from "@components/ui/Buttons";
import useClickOutside      from '@hooks/useClickOutside';

interface OptionsMenuProps {
  onEdit: () => void;
  onDelete: () => void;
  className?: string;
}

export default function OptionsMenu({ onEdit, onDelete, className }: OptionsMenuProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useClickOutside(ref, () => setOpen(false));

  return (
    <div ref={ref} className={`relative ${className ?? ''}`}>
      <Button
        variant="icon"
        size="sm"
        icon={MoreVertical}
        aria-label="Mais opções"
        aria-haspopup="menu"
        onClick={() => setOpen(v => !v)}
      />

      {open && (
        <div
          className="absolute right-0 mt-2 w-32 bg-[var(--surface-bg)] border border-[var(--border-base)] rounded shadow-lg z-10"
          role="menu"
        >
          <button
            onClick={() => { setOpen(false); onEdit(); }}
            className="w-full text-left px-4 py-2 text-sm hover:bg-[var(--surface-card-hover)]"
            role="menuitem"
          >
            Editar
          </button>
          <button
            onClick={() => { setOpen(false); onDelete(); }}
            className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-[var(--surface-card-hover)]"
            role="menuitem"
          >
            Remover
          </button>
        </div>
      )}
    </div>
  );
}
