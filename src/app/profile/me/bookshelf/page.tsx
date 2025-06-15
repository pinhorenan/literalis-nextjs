// File: src/app/profile/me/bookshelf/page.tsx
import { getServerSession }   from 'next-auth';
import { redirect }           from 'next/navigation';
import { authOptions }        from '@server/auth';

export default async function MeBookshelfPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.username) {
    return redirect('/signin');
  }

  return redirect(`/profile/${session.user.username}/bookshelf`);
}
