import { notFound } from 'next/navigation';
import ProfilePage from '@/src/app/profile/ProfileShell';

export default async function UserProfile({ params }: { params: { id: string } }) {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/${params.id}`, {
        next: { revalidate: 60 },
    });

    if (!res.ok) return notFound();

    const data = await res.json();
    return <ProfilePage initialUser={data.user} initialPosts={data.posts} />
}