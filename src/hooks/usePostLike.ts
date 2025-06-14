// File: src/hooks/usePostLike.ts
'use client';

import { useCallback, useState } from 'react';

interface UsePostLikeReturn {
  liked: boolean;
  likeCount: number;
  loading: boolean;
  toggleLike: () => Promise<void>;
}

/**
 * Hook que encapsula lógica de curtir/descurtir um post.
 * @param postId ID do post
 * @param initiallyLiked estado inicial (feed)
 * @param initialCount contagem inicial de likes
 */
export function usePostLike(
  postId: string,
  initiallyLiked: boolean,
  initialCount: number
): UsePostLikeReturn {
  const [liked, setLiked] = useState(initiallyLiked);
  const [likeCount, setLikeCount] = useState(initialCount);
  const [loading, setLoading] = useState(false);

  const toggleLike = useCallback(async () => {
    if (loading) return;

    setLoading(true);

    try {
      const method = liked ? 'DELETE' : 'POST';
      const res = await fetch(`/api/posts/${postId}/likes`, {
        method,
        credentials: 'include',
      });

      if (!res.ok) {
        const msg = await res.text();
        console.error('Erro ao alterar like:', msg);
        return;
      }

      setLiked(!liked);
      setLikeCount(liked ? likeCount - 1 : likeCount + 1);
    } catch (err) {
      console.error('Erro inesperado ao dar like:', err);
    } finally {
      setLoading(false);
    }
  }, [liked, likeCount, loading, postId]);

  return { liked, likeCount, loading, toggleLike };
}
