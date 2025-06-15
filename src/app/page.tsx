// File: src/app/page.tsx

import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth';
import { authOptions } from '@server/auth';
import LandingContent from '@components/landing/LandingContent';

export default async function Home() {
  const session = await getServerSession(authOptions);
  if (session) redirect('/feed');

  return <LandingContent />;
}