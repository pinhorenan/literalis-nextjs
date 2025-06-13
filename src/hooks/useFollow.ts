// hooks/useFollow.ts
'use client';

import { useCallback, useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';

/**
 * Encapsula todo o ciclo de vida de seguir/deixar de seguir um usuário.
 * @param targetUsername username do alvo
 * @param initiallyFollowing opcional - estado já conhecido (evita 1ª requisição)
 */
export function useFollow(targetUsername: string, initiallyFollowing = false) {
    const { data: session, status } = useSession();	
    const loggedIn = status === 'authenticated';
    const [following, setFollowing] = useState(initiallyFollowing);
    const [loading, setLoading] = useState(false);

    /** ----- efeito para descobrir follow ao montar ----- */
    useEffect(() => {
        if (!loggedIn || initiallyFollowing) return;

        let aborted = false;
        (async () => {
            setLoading(true);
            try {
                const res = await fetch(`/api/users/${targetUsername}/follow`, { credentials: 'include' });
                if (!aborted && res.ok) {
                    const { following } = await res.json();
                    setFollowing(Boolean(following));
                }
            } finally {
                !aborted && setLoading(false);
            }
        })();

        return () => { aborted = true; };
    }, [loggedIn, targetUsername]);

    /** ----- action ----- */
    const toggleFollow = useCallback(async () => {
        if (!loggedIn || loading) return;
        const method = following ? 'DELETE' : 'POST';
        setLoading(true);
        const res = await fetch(`/api/users/${targetUsername}/follow`, { credentials: 'include', method });
        if (res.ok) setFollowing(!following);
        setLoading(false);
    }, [loggedIn, following, loading, targetUsername]);

    return { following, toggleFollow, loading, loggedIn };
}
