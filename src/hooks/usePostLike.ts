// File: src/hook/usePostLike.ts
'use client';

import { useCallback, useState } from 'react';

interface UsePostLikeReturn {
    liked: boolean;
    likeCount: number;
    loading: boolean;
    toggleLike: () => Promise<void>;
}

/**
 * Encapsula lógica de curtir/descurtir um post.
 * @param postId ID do post
 * @param initiallyLiked estado inicial (vem do feed)
 * @param initialCount contagem inicial de likes
 */
export function usePostLike(
    postId: string,
    initiallyLiked: boolean,
    initialCount: number
): UsePostLikeReturn {
    const [liked, setLiked]     = useState(initiallyLiked);
    const [likeCount, setCount] = useState(initialCount);
    const [loading, setLoading] = useState(false);

    const toggleLike = useCallback(async () => {
        if (loading) return;
        setLoading(true);

        const method = liked ? 'DELETE' : 'POST';
        const res = await fetch(`/api/posts/${postId}/likes`, {
            credentials: 'include',
            method
        });

        if (res.ok) {
            setLiked(!liked);
            setCount((c) => c + (liked ? -1 : 1));
        } else {
            console.error('Erro ao togglear like', await res.text());
        }

        setLoading(false);
    }, [liked, loading, postId]);
    
    return { liked, likeCount, loading, toggleLike };
}
