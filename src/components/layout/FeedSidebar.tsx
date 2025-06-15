// File: src/components/sidebar/FeedSidebar.tsx
'use client';

import   SidebarShell  from '@components/layout/SidebarShell';
import   UserSummary   from '@components/ui/UserSummary';
import { Button  } from '@components/ui/Buttons';
import { BookOpen } from 'lucide-react';

interface FeedSidebarProps {
  onNewBook?: () => void; // todo: fazer a função de novo livro
}

export default function FeedSidebar({ onNewBook }: FeedSidebarProps) {
  return (
    <SidebarShell position="right">
      <UserSummary />

      <hr className="border-[var(--border-subtle)] my-4" />

      <Button
        variant="default"
        size="sm"
        className="w-full gap-2 justify-center rounded-lg"
        onClick={onNewBook}
      >
        <BookOpen size={20} />
        <span className="text-sm">Novo Livro</span>
      </Button>
    </SidebarShell>
  );
}
