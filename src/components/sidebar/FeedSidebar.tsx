// File: src/components/sidebar/FeedSidebar.tsx
'use client';

import { SidebarShell } from '@components/layout/SidebarShell';
import { UserSummary  } from '@/src/components/ui/UserSummary';
import { Button       } from '@components/ui/Buttons';
import { BookOpen     } from 'lucide-react';

interface ProfileSidebarProps {
    onNewBook?: () => void;
}

export function FeedSidebar({ onNewBook }: ProfileSidebarProps) {
    return (
        <SidebarShell position="right">
            <UserSummary />

            <hr className="border-[var(--border-subtle)]" />

            <Button
                variant="default"
                size="sm"
                className="w-full gap-2 justify-center hover:bg-[var(--surface-card-hover)] border-none rounded-lg"
                onClick={onNewBook}
            >
                <BookOpen size={20} className="text-[var(--text-secondary)]" />
                <span className="text-sm text-[var(--text-secondary)]">Novo Livro</span>  
            </Button>
        </SidebarShell>
    );
}