// File: src/hook/useFeed.ts
'use client';

import useSWR           from 'swr';
import { useSession }   from 'next-auth/react';

import type { PostWithRelations }   from '@components/post/Post';
import type { Tab }                 from '@components/ui/FeedSwitch';

const fetcher = (url: string) =>
    fetch(url, { credentials: 'include' }).then((r) => {
        if (!r.ok) throw new Error(r.statusText);
        return r.json();
    });

export function useFeed(tab: Tab) {
    const { data: session } = useSession();
    const mode = tab === 'friends' ? 'friends' : 'all';

    const { data, error, isLoading } = useSWR(
        `/api/feed?mode=${mode}&limit=20`,
        fetcher
    );

    const posts: PostWithRelations[] = data?.posts ?? [];

    return { posts, isLoading, error };
}