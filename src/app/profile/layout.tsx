// File: src/app/profile/layout.tsx
import { ReactNode }  from 'react';
import PrimarySidebar from '@components/sidebar/PrimarySidebar';
import FeedSidebar    from '@components/feed/FeedSidebar';

export default function ProfileLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex justify-between gap-6">
      <PrimarySidebar/>
      <div className="flex-1 overflow-y-auto px-4">{children}</div>
      <FeedSidebar />
    </div>
  );
}
