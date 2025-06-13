// hooks/useFeed.ts
'use client';

import useSWR from 'swr';
import { useSession } from 'next-auth/react';
import type { PostWithRelations } from '@components/post/Post';
import type { Tab } from '@components/ui/FeedSwitch';

const fetcher = (url: string) =>
    fetch(url, { credentials: 'include'}).then(async (r) => {
        if (!r.ok) throw new Error(await r.text());
        return r.json();
    });

    /** ----- Transforma JSON cru -> tipagem interna */
    function mapApiPost(p: any, meUsername?: string): PostWithRelations {
        const likedByMe = meUsername ? p.likes?.some((l: any) => l.username === meUsername) : false;

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
        };
    }

    /** Hook principal */
    export function useFeed(tab: Tab) {
        const { data: session } = useSession();
        const mode = tab === 'friends' ? 'friends' : 'all';

        const { data, error, isLoading, mutate } = useSWR(`/api/feed?mode=${mode}&limit=20`, fetcher);

        const posts: PostWithRelations[] = data?.posts?.map((post: any) => mapApiPost(post, session?.user.username)) ?? [];

        
    }