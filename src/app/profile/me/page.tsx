// app/profile/me/page.tsx
import { getServerSession } from 'next-auth';
import { authOptions } from '@server/auth';
import { notFound } from '@server/http';
import ProfileShell from '@components/profile/ProfileShell';

export default async function MyProfilePage() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.username) return notFound();

  // busca perfil e posts via o mesmo endpoint
  const res = await fetch(`/api/users/${session.user.username}`, {
  next: { revalidate: 60 },
  });
  if (!res.ok) return notFound();

  const { user, posts } = await res.json();

  return <ProfileShell initialUser={user} initialPosts={posts} />;
}
