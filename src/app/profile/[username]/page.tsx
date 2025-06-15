// File: src/app/profile/[username]/page.tsx

import { notFound } from 'next/navigation';
import { prisma }   from '@server/prisma';
import ProfileShell from '@components/profile/ProfileShell';
import type { ClientPost } from '@/src/types/posts';

interface ProfilePageProps {
  params: { username: string };
}

export default async function ProfilePage({ params }: ProfilePageProps) {
  const { username } = await params; // ? turbopack tá incomodando se não usar await aqui

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

  const posts: ClientPost[] = rawPosts.map((post) => ({
    id:                 post.id,
    excerpt:            post.excerpt,
    progress:           post.progress,
    createdAt:          post.createdAt.toISOString(),
    updatedAt:          post.updatedAt.toISOString(),
    likeCount:          post.likes.length,
    commentCount:       post.comments.length,
    likedByMe:          false,
    isFollowingAuthor:  false,
    
    author: {
      username:         post.author.username,
      name:             post.author.name,
      avatarUrl:        post.author.avatarUrl,
    },

    book: {
      isbn:             post.book.isbn,
      title:            post.book.title,
      author:           post.book.author,
      coverUrl:         post.book.coverUrl,
    },

    comments:           post.comments.map((comment) => (
      {
      id:               comment.id,
      content:          comment.content,
      createdAt:        comment.createdAt.toISOString(),
      author: 
        {
        username:       comment.author.username,
        name:           comment.author.name,
        avatarUrl:      comment.author.avatarUrl,
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
