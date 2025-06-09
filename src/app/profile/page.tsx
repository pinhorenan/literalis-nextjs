// app/profile/page.tsx
import { getServerSession } from 'next-auth';
import { authOptions } from '@/src/server/auth';
import ProfileShell from './ProfileShell';
import { notFound } from 'next/navigation';

export default async function MyProfilePage() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return notFound();

  // busca perfil e posts via o mesmo endpoint
  const res = await fetch(`/api/users/${session.user.id}`, {
  next: { revalidate: 60 },
  });
  if (!res.ok) return notFound();

  const { user, posts } = await res.json();

  return <ProfileShell initialUser={user} initialPosts={posts} />;
}
