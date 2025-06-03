'use client';

import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';
import clsx from 'clsx';

import { Heart }      from 'lucide-react';
import { Button }     from '@/src/components/ui/Button';
import { IconButton } from '@/src/components/ui/IconButton';
import { ProgressBar } from '@/src/components/feed/ProgressBar';

import type { Post, User, Book, Comment } from '@prisma/client';

import { relativeTime } from '@/src/lib/relativeTime';

type CommentWithAuthor = Comment & { author: User };

export interface Props {
  post: Post;
  author: User;
  book: Book;
  comments: CommentWithAuthor[];
  onAddComment: (text: string) => void;
}

export default function PostCard({
  post,
  author,
  book,
  comments,
  onAddComment,
}: Props) {
  // comentários em estado local (para exibir imediatamente)
  const [cmts, setCmts] = useState<CommentWithAuthor[]>(comments);
  useEffect(() => setCmts(comments), [comments]); // sincroniza quando a prop mudar

  /* ───────────────────────── Likes ─────────────────────────── */
  const LIKE_KEY = 'literalis_post_likes';
  const [liked, setLiked] = useState<boolean>(() => {
    try {
      return JSON.parse(localStorage.getItem(LIKE_KEY) || '{}')[post.id] ?? false;
    } catch {
      return false;
    }
  });
  const toggleLike = () => {
    setLiked(prev => {
      const next = !prev;
      const map  = JSON.parse(localStorage.getItem(LIKE_KEY) || '{}');
      map[post.id] = next;
      localStorage.setItem(LIKE_KEY, JSON.stringify(map));
      return next;
    });
  };

  /* ───────────────────────── Follow ────────────────────────── */
  const FOLLOW_KEY = 'literalis_user_follows';
  const [following, setFollowing] = useState<boolean>(() => {
    try {
      return JSON.parse(localStorage.getItem(FOLLOW_KEY) || '{}')[author.id] ?? false;
    } catch {
      return false;
    }
  });
  const toggleFollow = () => {
    setFollowing(prev => {
      const next = !prev;
      const map  = JSON.parse(localStorage.getItem(FOLLOW_KEY) || '{}');
      map[author.id] = next;
      localStorage.setItem(FOLLOW_KEY, JSON.stringify(map));
      return next;
    });
  };

  /* ───────────────────────── Relógio “há x min” ────────────── */
  const [when, setWhen] = useState(() => relativeTime(post.createdAt));
  useEffect(() => {
    const id = setInterval(() => setWhen(relativeTime(post.createdAt)), 60_000);
    return () => clearInterval(id);
  }, [post.createdAt]);

  /* ───────────────────────── Draft de novo comentário ───────────── */
  const [draft, setDraft] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  const handleComment = () => {
    const text = draft.trim();
    if (!text) return;
    onAddComment(text);
    setDraft('');
    inputRef.current?.focus();
  };

  /* ───────────────────────── JSX ───────────────────────────── */
  return (
    <article data-post-id={post.id} className="post flex flex-col gap-4 border-b border-[var(--olivy)] pb-4">
      <header className="flex justify-between items-center gap-4 pt-4 border-t border-[var(--olivy)]">
        <div className="flex items-center gap-4">
          <Image
            src={author.avatarPath}
            alt={`Avatar de ${author.name}`}
            width={60}
            height={60}
            className="rounded-full border border-[var(--olivy)]"
          />
          <span className="font-semibold">{author.name}</span>
        </div>

        <Button variant={following ? 'primary' : 'secondary'} size="sm" onClick={toggleFollow}>
          {following ? 'Seguindo' : 'Seguir'}
        </Button>

        <time dateTime={post.createdAt} className="text-sm ml-auto text-[var(--olive)]">
          {when}
        </time>
      </header>

      {/* Livro + progresso */}
      <div className="flex flex-col gap-2 pb-4 border-b border-[var(--olivy)]">
        <div className="flex gap-5">
          <img
            src={book.coverPath}
            alt={book.title}
            className="w-auto max-h-[360px] object-cover rounded border border-[var(--olivy)]"
          />
          <div className="flex flex-col gap-3 mt-2">
            <h2 className="text-lg font-semibold">{book.title}</h2>
            <p className="text-sm text-gray-600">por {book.author}</p>
            <p className="text-xs text-gray-500">{book.publisher}, edição {book.edition}</p>
            <p className="text-sm">{book.pages} páginas &ndash; {book.language}</p>
            <p className="text-sm font-medium">{post.progressPct}% lido</p>
            <ProgressBar pct={post.progressPct} />
          </div>
        </div>
      </div>

      {/* Texto do post */}
      <p className="text-lg leading-relaxed pb-4 border-b border-[var(--olivy)]">
        {post.excerpt}
      </p>

      {/* Comentários + formulário */}
      <footer className="flex flex-col gap-4">
        {cmts.length ? (
          cmts.map(c => <CommentItem key={c.id} comment={c} />)
        ) : (
          <p className="italic text-[var(--olive)] text-center">
            Este post ainda não tem comentários. Seja o primeiro a comentar!
          </p>
        )}

        <div className="flex items-center gap-4">
          <input
            ref={inputRef}
            value={draft}
            onChange={e => setDraft(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleComment()}
            type="text"
            placeholder="Escreva um comentário…"
            className="flex-1 border border-[var(--olivy)] rounded-sm px-2 py-1"
          />

          <Button variant="secondary" size="sm" onClick={handleComment}>
            Comentar
          </Button>

          <IconButton
            aria-label={liked ? 'Descurtir' : 'Curtir'}
            onClick={toggleLike}
            icon={Heart}
            size={24}
            className={clsx(liked ? 'text-[var(--olive)]' : 'text-gray-500','transition-colors')}
          />
        </div>
      </footer>
    </article>
  );
}

/* ───────────────────────── Item de comentário ───────────────────── */
function CommentItem({ comment }: { comment: CommentWithAuthor }) {
  const { author } = comment;
  return (
    <div className="flex items-center gap-2">
      <Image
        src={author.avatarPath}
        alt={'Avatar de ${author.name}'}
        width={36}
        height={36}
        className="rounded-full border border-[var(--olivy)]"
      />
      <p className="text-sm">
        <strong>{author.name}:</strong> {comment.text}
      </p>
    </div>
  );
}