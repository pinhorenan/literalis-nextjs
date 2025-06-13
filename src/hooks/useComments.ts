// hooks/useComments.ts
'use client';

import { useCallback, useState } from 'react';

export interface Comment {
    id: string;
    author: { username: string; avatarPath?: string };
    text: string;
    createdAt: Date;
}

interface UseCommentsReturn {
    comments: Comment[];
    loading: boolean;
    addComment: (text: string) => Promise<void>;
}

/**
 * Isola fetch de comentários e criação otimista.
 * @param postId ID do post
 * @param initialComments lista inicial (do feed)
 */
export function useComments( postId: string, initialComments: Comment[] = []): UseCommentsReturn {
    const [comments, setComments] = useState<Comment[]>(initialComments);
    const [loading, setLoading] = useState(false);

    const addComment = useCallback(async (text: string) => {
        if (loading || !text.trim()) return;
        setLoading(true);

        try {
            const res = await fetch(`/api/posts/${postId}/comments`, {
                credentials: 'include',
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ text }),
        });
        if (!res.ok) throw new Error(await res.text());

        const newComment: Comment = await res.json();
        setComments((c) => [...c, newComment]);
        } catch (err) {
        console.error('Erro ao adicionar comentário', err);
        } finally {
        setLoading(false);
        }
    }, [postId, loading]);

    return { comments, loading, addComment };
}