// File: src/app/search/layout.tsx

import { ReactNode }    from 'react';
import PrimarySidebar   from '@components/layout/PrimarySidebar';
import MobileBottomNav  from '@components/layout/MobileBottomNav';
import MobileHeader     from '@components/layout/MobileHeader';

export default function SearchLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex flex-col md:flex-row gap-4 md:gap-6 w-full max-w-screen-xl mx-auto px-4 md:px-8">
      <MobileHeader /> 
      <aside className="hidden lg:block w-[240px] shrink-0">
        <PrimarySidebar />
      </aside>

      <main className="flex-1 py-8 lg:py-0 min-w-0 my-6">
        {children}
      </main>

      <MobileBottomNav />
    </div>
  );
}
