// File: src/hooks/useFollow.ts
'use client';

import { useCallback, useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';

/**
 * Hook para seguir/deixar de seguir um usuário.
 * @param targetUsername username do alvo
 * @param initiallyFollowing opcional - estado já conhecido (evita 1ª requisição)
 */
export default function useFollow(targetUsername: string, initiallyFollowing?: boolean) {
  const { data: session, status } = useSession();
  const loggedIn = status === 'authenticated';
  const currentUser = session?.user?.username;
  const [following, setFollowing] = useState(initiallyFollowing ?? false);
  const [loading, setLoading] = useState(false);

  // Busca se está seguindo, apenas se `initiallyFollowing` for indefinido
  useEffect(() => {
    if (!loggedIn || typeof initiallyFollowing === 'boolean' || currentUser === targetUsername) return;

    let aborted = false;

    (async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/users/${targetUsername}/follow`, { credentials: 'include' });
        if (!aborted && res.ok) {
          const { following } = await res.json();
          setFollowing(Boolean(following));
        }
      } catch (err) {
        if (!aborted) console.error('Erro ao verificar follow:', err);
      } finally {
        if (!aborted) setLoading(false);
      }
    })();

    return () => {
      aborted = true;
    };
  }, [loggedIn, targetUsername, initiallyFollowing, currentUser]);

  // Alterna seguir/deixar de seguir
  const toggleFollow = useCallback(async () => {
    if (!loggedIn || loading || currentUser === targetUsername) return;

    const method = following ? 'DELETE' : 'POST';

    setLoading(true);
    try {
      const res = await fetch(`/api/users/${targetUsername}/follow`, {
        method,
        credentials: 'include',
      });
      if (res.ok) {
        setFollowing((prev) => !prev);
      }
    } catch (err) {
      console.error('Erro ao alternar follow:', err);
    } finally {
      setLoading(false);
    }
  }, [loggedIn, loading, following, targetUsername, currentUser]);

  return { following, toggleFollow, loading, loggedIn };
}

