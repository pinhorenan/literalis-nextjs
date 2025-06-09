// src/components/feed/PostCard.tsx
'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import clsx from 'clsx';
import { Heart, MessageCircle } from 'lucide-react';
import { Button } from '@/src/components/ui/Buttons';
import type { Post, User, Book, Comment } from '@prisma/client';
import { relativeTime } from '@/src/lib/relativeTime';

export type CommentWithAuthor = Comment & { author: User };

export interface PostWithRelations extends Post {
  author: User;
  book: Book;
  comments: CommentWithAuthor[];
  commentsCount: number;
  reactionsCount: number;
}

interface Props {
  post: PostWithRelations;
  onAddComment: (postId: string, text: string) => void;
}

export default function PostCard({ post, onAddComment }: Props) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const me = session?.user;

  /* ------------------------------------------------------------
   *  STATE
   * ------------------------------------------------------------ */
  const [liked, setLiked] = useState<boolean>(false);
  const [likeCount, setLikeCount] = useState<number>(post.reactionsCount);
  const [following, setFollowing] = useState<boolean>(false);
  const [draft, setDraft] = useState<string>('');
  const inputRef = useRef<HTMLInputElement>(null);

  /* ------------------------------------------------------------
   *  SYNC LIKE / FOLLOW STATUS
   * ------------------------------------------------------------ */
  useEffect(() => {
    if (status !== 'authenticated') return;
    (async () => {
      try {
        const [likeRes, followRes] = await Promise.all([
          fetch(`/api/posts/${post.id}/likes/me`),
          fetch(`/api/users/${post.authorId}/follows/me`),
        ]);
        const { liked: l } = await likeRes.json();
        const { follows: f } = await followRes.json();
        setLiked(Boolean(l));
        setFollowing(Boolean(f));
      } catch (err) {
        console.error(err);
      }
    })();
  }, [post.id, post.authorId, status]);

  /* ------------------------------------------------------------
   *  HANDLERS
   * ------------------------------------------------------------ */
  const toggleLike = async () => {
    if (status !== 'authenticated') return router.push('/login');
    const method = liked ? 'DELETE' : 'POST';
    const res = await fetch(`/api/posts/${post.id}/like`, { method });
    if (res.ok) {
      setLiked(!liked);
      setLikeCount(count => count + (liked ? -1 : 1));
    }
  };

  const toggleFollow = async () => {
    if (status !== 'authenticated') return router.push('/login');
    const method = following ? 'DELETE' : 'POST';
    const res = await fetch(`/api/users/${post.authorId}/follow`, { method });
    if (res.ok) setFollowing(!following);
  };

  const handleComment = () => {
    const text = draft.trim();
    if (!text) {
      inputRef.current?.focus();
      return;
    }
    onAddComment(post.id, text);
    setDraft('');
    inputRef.current?.focus();
  };

  /* ------------------------------------------------------------
   *  RENDER
   * ------------------------------------------------------------ */
  return (
    <article className="bg-[var(--surface-card)] rounded-lg shadow-sm overflow-hidden mx-2 md:mx-4">
      {/* HEADER: autor + follow */}
      <header className="flex items-center justify-between p-4">
        <div className="flex items-center gap-3">
          <Link href={`/profile/${post.author.id}`}>
            <Image
              src={post.author.avatarPath || '/assets/avatar_placeholder.svg'}
              alt={post.author.name}
              width={40}
              height={40}
              className="rounded-full"
            />
          </Link>
          <div>
            <Link href={`/profile/${post.author.id}`} className="font-semibold hover:underline">
              {post.author.name}
            </Link>
            <time className="block text-xs text-[var(--text-secondary)]">
              {relativeTime(post.createdAt)}
            </time>
          </div>
        </div>
        {me?.id !== post.authorId && (
          <Button size="sm" variant="default" onClick={toggleFollow}>
            {following ? 'Seguindo' : 'Seguir'}
          </Button>
        )}
      </header>

      {/* BOOK + EXCERPT */}
      <div className="flex flex-col md:flex-row gap-4 p-4 border-t border-b border-[var(--border-base)]">
        <Image
          src={post.book.coverPath}
          alt={`Capa: ${post.book.title}`}
          width={100}
          height={150}
          className="rounded object-cover border"
        />
        <div className="flex flex-col justify-between md:w-2/5">
          <div>
            <h2 className="text-lg font-semibold">{post.book.title}</h2>
            <p className="text-sm text-[var(--text-secondary)]">por {post.book.author}</p>
            <p className="text-xs text-[var(--text-tertiary)]">
              {post.book.publisher}, ed. {post.book.edition}
            </p>
            <p className="text-xs text-[var(--text-tertiary)]">
              {post.book.pages} páginas • {post.book.language}
            </p>
            <p className="text-xs text-[var(--text-tertiary)]">
              Publicado em {new Date(post.book.publicationDate).toLocaleDateString()}
            </p>
          </div>
          <div>
            <p className="text-sm mb-1">{post.progressPct}% lido</p>
            <div className="h-1 bg-[var(--surface-alt)] rounded overflow-hidden">
              <div
                className="h-full bg-[var(--color-primary)]"
                style={{ width: `${post.progressPct}%` }}
              />
            </div>
          </div>
        </div>
        <p className="md:flex-1 leading-relaxed text-sm">{post.excerpt}</p>
      </div>

      {/* COMMENTS + LIKE / SEND */}
      <div className="p-4 space-y-4 border-t border-[var(--border-base)]">
        {post.comments.length ? (
          post.comments.map(c => (
            <div key={c.id} className="flex items-start gap-3">
              <Image
                src={c.author.avatarPath || '/assets/avatar_placeholder.svg'}
                alt={c.author.name}
                width={32}
                height={32}
                className="rounded-full"
              />
              <div className="flex-1">
                <p className="text-sm">
                  <strong>{c.author.name}</strong> {c.text}
                </p>
                <time className="text-xs text-[var(--text-tertiary)]">
                  {relativeTime(c.createdAt)}
                </time>
              </div>
            </div>
          ))
        ) : (
          <p className="italic text-[var(--text-tertiary)] text-center">
            Ainda não há comentários. Seja o primeiro!
          </p>
        )}

        <div className="flex items-center gap-4">
          <button onClick={toggleLike} className="flex items-center gap-1">
            <Heart
              className={clsx('cursor-pointer transition-colors', liked && 'text-red-500 fill-current')}
            />
            <span>{likeCount}</span>
          </button>

          <button
            onClick={handleComment}
            className="flex items-center gap-1 disabled:opacity-40"
            disabled={!draft.trim()}
            title="Enviar comentário"
          >
            <MessageCircle />
            <span>{post.commentsCount}</span>
          </button>

          <input
            ref={inputRef}
            type="text"
            placeholder="Escreva um comentário…"
            value={draft}
            onChange={e => setDraft(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleComment()}
            className="flex-1 border rounded p-2"
          />
        </div>
      </div>
    </article>
  );
}
