// File: src/app/profile/[username]/shelf/layout.tsx
import { ReactNode }  from 'react';
import PrimarySidebar from '@components/sidebar/PrimarySidebar';
import FeedSidebar    from '@components/feed/FeedSidebar';

export default function ShelfLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex justify-between gap-6">
      <PrimarySidebar/>
      {children}
      <FeedSidebar />
    </div>
  );
}
