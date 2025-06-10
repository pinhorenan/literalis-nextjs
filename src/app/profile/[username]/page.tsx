// app/profile/[username]/page.tsx
import { notFound } from '@server/http';
import { prisma }       from '@server/prisma';
import ProfileShell from '@components/profile/ProfileShell';

interface Props { params: { username: string } }

export default async function UserProfile({ params }: Props) {
  const dbUser = await prisma.user.findUnique({
    where: { username: params.username },
    include: {
      posts: { 
        orderBy: { createdAt: 'desc' },
        include: {
          author: true,
          book: true,
          comments: { include: { author: true } }
        },
      }, 
      followers: { select: { followerId: true } },
      following: { select: { followedId: true } }
    }
  });

  if (!dbUser) return notFound();

  const {
    id,
    username,
    name,
    email,
    avatarPath,
    bio,
    followers,
    following,
    posts
  } = dbUser;

  const initialUser = {
    id,
    username,
    name,
    email: email ?? undefined,
    avatarPath: avatarPath ?? '/assets/images/users/default.jpg',
    bio: bio ?? undefined,
    followerIds: followers.map(f => f.followerId),
    followingIds: following.map(f => f.followedId),
  };

  const initialPosts = posts;

  return (
    <ProfileShell initialUser={initialUser} initialPosts={initialPosts} />
  );
}
