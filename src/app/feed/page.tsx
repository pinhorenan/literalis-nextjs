// File: src/app/feed/page.tsx
import FeedClient                   from '@components/feed/FeedClient';
import { prisma }                   from '@server/prisma';
import { mapRawToClientPost }       from '@lib/mapPost';
import type { RawPost, ClientPost } from '../../types/posts';

export default async function PageFeed() {
  const rawPosts = await prisma.post.findMany({
    take: 20,
    orderBy: { createdAt: 'desc' },
    include: {
      author: true,
      book: true,
      comments: { include: { author: true } },
      likes: true,
    },
  }) as RawPost[];

  const initialPosts: ClientPost[] = rawPosts.map(mapRawToClientPost);

  return (
    <>
      <FeedClient initialPosts={initialPosts} initialTab="discover" />
    </>
  );
}
