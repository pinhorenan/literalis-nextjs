// File: src/hooks/useFeed.ts
'use client';

import useSWR from 'swr';
import { useSession } from 'next-auth/react';
import type { ClientPost } from '@/src/types/posts';

/**
 * Hook de carregamento do feed de posts.
 * Substitui PostWithRelations por tipo simplificado para o frontend.
 * 
 * @param tab - aba selecionada, 'friends' ou 'discover'
 * @returns Lista de posts, estado de carregamento e erro
 */
export default function useFeed(tab: 'friends' | 'discover') {
  const { data: session } = useSession();
  const mode = tab === 'friends' ? 'friends' : 'all';

  const fetcher = async (url: string) => {
    const res = await fetch(url, { credentials: 'include' });
    if (!res.ok) throw new Error(await res.text());
    return res.json();
  };

  const { data, error, isLoading } = useSWR<{ posts: ClientPost[] }>(
    `/api/feed?mode=${mode}&limit=20`,
    fetcher
  );

  return {
    posts: data?.posts ?? [],
    isLoading,
    error,
  };
}
