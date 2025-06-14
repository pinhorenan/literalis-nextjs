// app/profile/layout.tsx

import { ReactNode } from 'react';
import { PrimarySidebar } from '@components/sidebar/PrimarySidebar';
import { FeedSidebar } from '@components/sidebar/FeedSidebar';

export default function ProfileLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <PrimarySidebar/>
      {children}
      <FeedSidebar />
    </>
  );
}
