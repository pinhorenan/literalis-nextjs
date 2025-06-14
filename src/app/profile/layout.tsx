// File: src/app/profile/layout.tsx
'use client';

import { ReactNode } from 'react';
import { PrimarySidebar } from '@components/sidebar/PrimarySidebar';
import { FeedSidebar } from '@components/sidebar/FeedSidebar';

export default function ProfileLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex gap-6">
      <PrimarySidebar/>
      <main className="flex-1 p-4 ">{children}</main>
      <FeedSidebar />
    </div>
  );
}
