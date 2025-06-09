// app/profile/me/shelf/layout.tsx
'use client';

import { ReactNode } from 'react';
import { MainSidebar, RecommendedSidebar } from '@components/layout/Sidebar';

export default function ShelfLayout({ children }: { children: ReactNode }) {
  return (
    <section className="flex gap-4">
      <MainSidebar />
      <main className="flex-1 px-4 py-6 space-y-6">{children}</main>
      <RecommendedSidebar />
    </section>
  );
}
