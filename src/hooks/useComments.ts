// File: src/hooks/useComments.ts
'use client';

import { useCallback, useState } from 'react';
import { useSession } from 'next-auth/react';
import type { ClientComment } from '@/src/types/posts';

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
  const { data: session } = useSession();
  const [comments, setComments] = useState<ClientComment[]>(initialComments);
  const [loading, setLoading] = useState(false);

  const addComment = useCallback(
    async (content: string) => {
      const trimmed = content.trim();
      if (loading || !trimmed) return;

      setLoading(true);

      const username = session?.user?.username || 'me';
      const name = session?.user?.name;
      const avatarUrl = session?.user?.image;

      const tempId = `temp-${Date.now()}`
      const tempComment: ClientComment = {
        id: tempId,
        content: trimmed,
        createdAt: new Date().toISOString(),
        author: {
          username: username,
          name: name,
          avatarUrl: avatarUrl,
        },
      };

      setComments((prev) => [...prev, tempComment])

      try {
        const res = await fetch(`/api/posts/${postId}/comments`, {
          method: 'POST',
          credentials: 'include',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ content: trimmed }),
        });

        if (!res.ok) throw new Error(await res.text());

        const savedComment: ClientComment = await res.json();

        setComments((prev) =>
          prev.map((c) => (c.id === tempId ? savedComment : c))
        );        
      } catch (err) {
        console.error('Erro ao adicionar comentário:', err);
        setComments((prev) => prev.filter((c) => c.id !== tempId));
      } finally {
        setLoading(false);
      }
    },
    [postId, loading]
  );

  return { comments, loading, addComment };
}
