'use client';
import { useState } from 'react';

import { Button } from '@/src/components/ui/Button';

export type Tab = 'discover' | 'friends';

interface FeedSwitchProps {
  onChange: (t: Tab) => void
  className?: string
}

export function FeedSwitch({
  onChange,
  className = 'flex items-center gap-2 w-full my-6',
}: FeedSwitchProps) {
  const [tab, setTab] = useState<Tab>('discover');

  const handle = (t: Tab) => {
    setTab(t);
    onChange(t);
  };

  return (
    <div className={className}>
      <div className="flex-1 h-px bg-[var(--olivy)]" aria-hidden />

      {/* Botão "Descobrir" */}
      <Button
        variant={tab === 'discover' ? 'primary' : 'secondary'}
        size="sm"
        className="px-4 py-2"
        onClick={() => handle('discover')}
        disabled={tab ==='discover'}
      >
        Descobrir
      </Button>

      {/* Botão "Amigos" */}
      <Button
        variant={tab === 'friends' ? 'primary' : 'secondary'}
        size="sm"
        className="px-4 py-2"
        onClick={() => handle('friends')}
        disabled={tab === 'friends'}
      >
        Amigos
      </Button>

      <div className="flex-1 h-px [var(--bg-olivy)]" aria-hidden />
    </div>
  );
}
