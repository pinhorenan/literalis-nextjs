// File: src/components/ui/OptionsMenu.tsx
'use client';

import { useState, useRef } from 'react';
import { useClickOutside } from '@hooks/useClickOutside';
import { Button } from "@components/ui/Buttons";
import { MoreVertical } from 'lucide-react';

interface OptionsMenuProps {
    onEdit: () => void;
    onDelete: () => void;
    className?: string;
}

export function OptionsMenu({ onEdit, onDelete }: OptionsMenuProps) {
    const [open, setOpen] = useState(false);
    const ref = useRef<HTMLDivElement>(null);
    useClickOutside(ref, () => setOpen(false));

    return (
        <div ref={ref} className="relative">
            <Button
                variant="icon"
                size="sm"
                icon={MoreVertical}
                aria-label="Mais opções"
                onClick={() => setOpen(v => !v)}
            />
            {open && (
                <div className="absolute right-0 mt-2 w-32 bg-[var(--surface-bg)] border border-[var(--border-base)] rounded shadow-lg z-10">
                    <button
                        onClick={() => { setOpen(false); onEdit(); }}
                        className="w-full text-left px-4 py-2 text-sm hover:bg-[var(--surface-card-hover)]"
                    >
                        Editar
                    </button>
                    <button
                        onClick={() => { setOpen(false); onDelete(); }}
                        className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-[var(--surface-card-hover)]"
                    >
                        Remover
                    </button>
                </div>
            )}
        </div>
    );
}