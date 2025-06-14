// File: src/app/profile/layout.tsx
import { ReactNode }  from 'react';
import PrimarySidebar from '@components/layout/PrimarySidebar';
import FeedSidebar    from '@components/layout/FeedSidebar';
import { MobileBottomNav } from '@components/layout/MobileBottomNav';

export default function FeedLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex flex-col md:flex-row gap-4 md:gap-6 w-full max-w-screen-xl mx-auto px-4 md:px-8">
      <aside className="hidden md:block w-[240px] shrink-0">
        <PrimarySidebar />
      </aside>

      <main className="flex-1 min-w-0">
        {children}
      </main>
      
      <aside className="hidden lg:block w-[240px] shrink-0">
        <FeedSidebar />
      </aside>

      <MobileBottomNav />
    </div>
  );
}
