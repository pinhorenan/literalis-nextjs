// File: src/lib/mapPost.ts
import type { RawPost, ClientPost } from '../types/posts';

export function mapRawToClientPost(p: RawPost): ClientPost {
    return {
        postId: p.postId,
        excerpt: p.excerpt,
        progressPct: p.progressPct,
        createdAt: p.createdAt.toISOString(),
        updatedAt: p.updatedAt.toISOString(),
        comments: p.comments.map(c => ({
            commentId: c.commentId,
            text: c.text,
            author: c.author,
            createdAt: c.createdAt.toISOString(),
        })),
        likeCount: p.likes.length,
        commentCount: p.comments.length,
        likedByMe: false, // será ajustado pelo cliente
        isFollowingAuthor: false, // será ajustado pelo cliente
        author: p.author,
        book: p.book,
    };
}
