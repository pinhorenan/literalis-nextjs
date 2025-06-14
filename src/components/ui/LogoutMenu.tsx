// File: src/components/ui/LogoutMenu.tsx
'use client';

import { useState } from 'react';
import { signOut }  from 'next-auth/react';
import { Settings, LogOut } from 'lucide-react';
import { Button, ThemeToggle } from '@components/ui/Buttons';

export function LogoutMenu() {
    const [open, setOpen] = useState(false);

    return (
        <div className="relative mt-auto self-start">
            <Button
                variant="default"
                className="bg-transparent hover:bg-[var(--surface-card-hover)] gap-3 rounded-lg border-none"
                onClick={() => setOpen((v) => !v)}
            >
                <Settings size={30} className="text-[var(--text-secondary)]" />
                <strong className="text-lg text-[var(--text-secondary)]">Preferências</strong>
            </Button>

            {open && (
                <div className="absolute flex flex-col bottom-full mb-2 left-0 w-40 bg-[var(--surface-bg)] border border-[var(--border-base)] rounded-lg shadow-[var(--shadow-sm)] p-2 space-y-1 z-10 align-middle">
                    <ThemeToggle />
                    
                    <Button
                      onClick={() => signOut()}
                      iconSize={30}
                      className="bg-transparent hover:bg-[var(--surface-card-hover)] gap-3 rounded-lg border-none"
                    >
                      <LogOut size={30}/><strong className="text-lg text-[var(--text-secondary)]">Sair</strong>
                    </Button>




                </div>
            )}
        </div>
    );
}