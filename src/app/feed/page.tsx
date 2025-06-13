// File: src/app/feed/page.tsx
'use client';

import { useState   } from 'react';
import { useSession } from 'next-auth/react';
import { useFeed } from '@hooks/useFeed';

import { MainSidebar, RecommendedSidebar }  from '@components/layout/Sidebar';
import { PostCard, PostCardSkeleton }       from '@components/post/Post';
import { FeedSwitch, type Tab }             from '@components/ui/FeedSwitch';


export default function PageFeed() {
  const { status } = useSession();
  const loggedIn = status === 'authenticated';
  
  const [tab, setTab] = useState<Tab>(loggedIn ? 'friends' : 'discover');
  const { posts, error, isLoading } = useFeed(tab);

  return (
    <section className="flex gap-4">
      <MainSidebar />

      <main className="px-4 py-6 space-y-6 mx-auto flex-1 max-w-[700px]">
        <FeedSwitch onChange={(t) => setTab(t)} />

        {isLoading ? (
          <PostCardSkeleton />
        ) : error ? (
          <p className="text-center text-red-500">{error.message}</p>
        ) : posts.length === 0 ? (
          <p className="text-center text-[var(--text-tertiary)]">Não há posts para mostrar.</p>
        ) : (
          posts.map((post) => (
            <PostCard key={post.id} post={post} />
          ))
        )}
      </main>

      <RecommendedSidebar />
    </section>
  )
}