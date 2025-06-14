// File: src/app/profile/layout.tsx
import { ReactNode }  from 'react';
import PrimarySidebar from '@components/sidebar/PrimarySidebar';
import FeedSidebar    from '@components/feed/FeedSidebar';

export default function FeedLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex justify-between gap-6 mx-20">
      <PrimarySidebar/>
      {children}
      <FeedSidebar />
    </div>
  );
}
