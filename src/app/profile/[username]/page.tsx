// File: src/app/profile/[username]/page.tsx

import { notFound } from 'next/navigation';
import { prisma } from '@server/prisma';
import ProfileShell from '@components/profile/ProfileShell';
import type { ClientPost } from '@/src/types/posts';

interface ProfilePageProps {
  params: { username: string };
}

export default async function ProfilePage({ params }: ProfilePageProps) {
  const { username } = params;

  const user = await prisma.user.findUnique({
    where:    { username },
    include:  {
      followers: { select: { follower: true } },
      following: { select: { followed: true } },
    },
  });

  if (!user) return notFound();

  const rawPosts = await prisma.post.findMany({
    where:    { authorUsername: username },
    include:  {
      author:   true,
      book:     true,
      likes:    true,
      comments: { include: { author: true } },
    },
    orderBy:    { createdAt: 'desc' },
  });

  const posts: ClientPost[] = rawPosts.map((p) => ({
    id:                 p.id,
    excerpt:            p.excerpt,
    progress:           p.progress,
    createdAt:          p.createdAt.toISOString(),
    updatedAt:          p.updatedAt.toISOString(),
    likeCount:          p.likes.length,
    commentCount:       p.comments.length,
    likedByMe:          false,
    isFollowingAuthor:  false,
    
    author: {
      username:         p.author.username,
      name:             p.author.name,
      avatarUrl:        p.author.avatarUrl,
    },

    book: {
      isbn:             p.book.isbn,
      title:            p.book.title,
      author:           p.book.author,
      coverUrl:         p.book.coverUrl,
    },

    comments: p.comments.map((c) => ({
      id:               c.id,
      content:          c.content,
      createdAt:        c.createdAt.toISOString(),
      author: {
        username:       c.author.username,
        name:           c.author.name,
        avatarUrl:      c.author.avatarUrl,
      },
    })),
  }));

  return (
    <ProfileShell
      initialUser={{
        username:           user.username,
        name:               user.name,
        avatarUrl:          user.avatarUrl,
        bio:                user.bio ?? undefined,
        followerUsernames:  user.followers.map((f) => f.follower.username),
        followingUsernames: user.following.map((f) => f.followed.username),
      }}
      initialPosts={posts}
    />
  );
}
