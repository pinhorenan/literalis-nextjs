// File: src/hooks/useComments.ts
'use client';

import { useCallback, useState } from 'react';

export interface ClientComment {
  id: string;
  content: string;
  createdAt: string; // padrão JSON (ISO)
  author: {
    username: string;
    name?: string;
    avatarUrl?: string;
  };
}

interface UseCommentsReturn {
  comments: ClientComment[];
  loading: boolean;
  addComment: (content: string) => Promise<void>;
}

/**
 * Hook para carregar e adicionar comentários com otimização no cliente.
 * @param postId ID do post alvo
 * @param initialComments Comentários iniciais (opcional)
 */
export function useComments(
  postId: string,
  initialComments: ClientComment[] = []
): UseCommentsReturn {
  const [comments, setComments] = useState<ClientComment[]>(initialComments);
  const [loading, setLoading] = useState(false);

  const addComment = useCallback(
    async (content: string) => {
      const trimmed = content.trim();
      if (loading || !trimmed) return;

      setLoading(true);
      try {
        const res = await fetch(`/api/posts/${postId}/comments`, {
          method: 'POST',
          credentials: 'include',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ content: trimmed }),
        });

        if (!res.ok) throw new Error(await res.text());

        const newComment: ClientComment = await res.json();
        setComments((prev) => [...prev, newComment]);
      } catch (err) {
        console.error('Erro ao adicionar comentário:', err);
      } finally {
        setLoading(false);
      }
    },
    [postId, loading]
  );

  return { comments, loading, addComment };
}
