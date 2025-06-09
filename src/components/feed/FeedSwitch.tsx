'use client';

import { useState } from 'react';
import { Button } from '@/src/components/ui/Buttons';

export type Tab = 'discover' | 'friends';

export function FeedSwitch({ onChange }: { onChange: (t: Tab) => void }) {
  const [tab, setTab] = useState<Tab>('discover');

  const switchTo = (t: Tab) => {
    if (t === tab) return;
    setTab(t);
    onChange(t);
  };

  return (
    <div className="flex items-center gap-4 my-4">
      <div className="flex-1 h-px bg-[var(--divider)]" />

      <Button
        size="sm"
        active={tab === 'discover'}
        onClick={() => switchTo('discover')}
      >
        Descobrir
      </Button>

      <Button
        size="sm"
        active={tab === 'friends'}
        onClick={() => switchTo('friends')}
      >
        Amigos
      </Button>

      <div className="flex-1 h-px bg-[var(--divider)]" />
    </div>
  );
}
