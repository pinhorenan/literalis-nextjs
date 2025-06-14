// File: src/components/feed/FeedClient.tsx
'use client';

import { useState } from 'react';
import useSWR from 'swr';
import { FeedSwitch, type Tab } from '@components/feed/FeedSwitch';
import { PostCard }         from '@components/post/Post';
import NewPostForm          from '@components/post/NewPostForm';
import PostSkeleton         from '@components/post/PostSkeleton';
import type { ClientPost }  from '@/src/types/posts';

const fetcher = (url: string) =>
  fetch(url, { credentials: 'include' })
    .then((r) => {
      if (!r.ok) throw new Error(r.statusText);
      return r.json();
    });

interface FeedClientProps {
  initialPosts: ClientPost[];
  initialTab: Tab;
}

interface FeedResponse {
  posts: ClientPost[];
}

export default function FeedClient({ initialPosts, initialTab }: FeedClientProps) {

  // todo: adicionar aqui um carrossel de livros recomendados

  const [tab, setTab] = useState<Tab>(initialTab);
  const mode = tab === 'friends' ? 'friends' : 'discover';
  const [followedMap, setFollowedMap] = useState(() => {
    const map: Record<string, boolean> = {};
    for (const post of initialPosts) {
      map[post.author.username] = post.isFollowingAuthor;
    }
    return map;
  })

  const updateFollowedMap = (username: string, isFollowing: boolean) => {
    setFollowedMap((prev) => ({ ...prev, [username]: isFollowing }));
  }

  const { data, error, isLoading } = useSWR<FeedResponse>(
    `/api/feed?mode=${mode}&limit=20`, // ? adicionar paginação OU scroll infinito
    fetcher,
    {
      fallbackData: { posts: initialPosts },
    }
  );

  const posts = data?.posts ?? [];

  return (
    <section className="flex flex-col gap-4">

      <NewPostForm />

      <FeedSwitch onChange={setTab} />

      {isLoading ? (
        <PostSkeleton />
      ) : error ? (
        <p className="text-center text-red-500">{(error as Error).message}</p>
      ) : posts.length === 0 ? (
        <p className="text-center text-[var(--text-tertiary)]">
          Não há posts para exibir.
        </p>
      ) : (
        posts.map((post) => 
        <PostCard 
        key={post.id} 
        post={{
          ...post,
          isFollowingAuthor: followedMap[post.author.username] ?? false,
        }} 
        onFollowChange={(nowFollowing) => updateFollowedMap(post.author.username, nowFollowing)}
        />)
      )}
    </section>
  );
}
