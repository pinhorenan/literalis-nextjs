// File: app/profile/me/page.tsx
import { getServerSession }   from 'next-auth';
import { authOptions }        from '@server/auth';
import { redirect }           from 'next/navigation';

export default async function MePage() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.username) {
    return redirect('/signin');
  }

  return redirect(`/profile/${session.user.username}`);
}
