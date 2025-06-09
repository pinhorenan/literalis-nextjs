// app/profile/layout.tsx
'use client';

import { ReactNode } from 'react';
import { MainSidebar, RecommendedSidebar } from '@components/layout/Sidebar';

export default function ProfileLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex gap-6">
      <MainSidebar
        /* TODO: buscar e repassar as props de progresso */
      />
      <main className="flex-1 p-4">{children}</main>
      <RecommendedSidebar />
    </div>
  );
}
