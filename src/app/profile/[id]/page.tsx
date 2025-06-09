// app/profile/[id]/page.tsx
import { notFound } from 'next/navigation';
import ProfileShell from '@/src/app/profile/ProfileShell';

interface Params {
  params: { id: string };
}

export default async function UserProfile({ params }: Params) {
  const res = await fetch(
    `/api/users/${params.id}`,
    { next: { revalidate: 60 } }
  );

  if (!res.ok) return notFound();

  const { user, posts } = await res.json();
  return <ProfileShell initialUser={user} initialPosts={posts} />;
}
