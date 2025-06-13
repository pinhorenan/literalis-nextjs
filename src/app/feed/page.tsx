// app/feed/page.tsx
'use client';

import { useEffect, useState, useCallback } from 'react';
import { useSession } from 'next-auth/react';
import useSWR from 'swr';

import { MainSidebar, RecommendedSidebar } from '@components/layout/Sidebar';
import { FeedSwitch, type Tab } from '@components/ui/FeedSwitch';
import {
  PostCard,
  PostCardSkeleton,
  type PostWithRelations,
  type CommentWithAuthor,
} from '@components/post/Post';

const fetcher = (url: string) => fetch(url, {credentials: 'include'}).then(res => {
  if (!res.ok) throw new Error(res.statusText);
  return res.json();
});

function mapApiPost(p: any, meUsername?: string): PostWithRelations {
  const likedByMe = meUsername ? p.likes?.some((l: any) => l.username === meUsername) : false
  return {
    id: p.postId,
    authorId: p.authorUsername,
    bookIsbn: p.bookIsbn,
    excerpt: p.excerpt,
    progressPct: p.progressPct,
    createdAt: new Date(p.createdAt),
    updatedAt: new Date(p.updatedAt),
    commentsCount: p.commentCount,
    reactionsCount: p.likeCount,
    author: p.author,
    book: p.book,
    comments: p.comments ?? [],
    likedByMe,
    isFollowingAuthor: p.isFollowingAuthor ?? false,
  }
}

// hook de feed
function useFeed(tab: Tab) {
  const { data: session } = useSession();
  const mode = tab === 'friends' ? 'friends' : 'all';
  const { data, error, isLoading, mutate } = useSWR(`/api/feed?mode=${mode}&limit=20`, fetcher);

  const posts: PostWithRelations[] = data?.posts?.map((post: any) => mapApiPost(post, session?.user.username)) ?? [];
  return { posts, error, isLoading, mutate };
}

export default function PageFeed() {
  const { status } = useSession();
  const loggedIn = status === 'authenticated';

  const [tab, setTab] = useState<Tab>(loggedIn ? 'friends' : 'discover');
  const { posts, error, isLoading, mutate } = useFeed(tab);

  // handler p/ adicionar comentário
  const handleAddComment = useCallback(
    async (postId: string, text: string) => {
      const res = await fetch(`/api/posts/${postId}/comments`, {
        credentials: 'include',
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text }),
    });
    if (!res.ok) return;
    const newComment = (await res.json()) as CommentWithAuthor;
    mutate((old: any) => {
      if (!old?.posts) return old;
      return {
        ...old,
        posts: old.posts.map((post: any) =>
          post.postId === postId
            ? {
                ...post,
                comments: [...post.comments, newComment],
                commentCount: post.commentCount + 1,
              }
            : post,  
          ),
        }
      }, false)
    },
    [mutate],
  );  

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
            <PostCard 
              key={post.id} 
              post={post} 
              onAddComment={handleAddComment} />
          ))
        )}
      </main>

        <RecommendedSidebar />
    </section>
  )
}