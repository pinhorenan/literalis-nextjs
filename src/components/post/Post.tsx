// File: src/components/post/Post.tsx
'use client';

import Link from 'next/link';
import clsx from 'clsx';
import Image from 'next/image';
import { useRef, useState, useCallback } from 'react';
import { Heart, MessageCircle } from 'lucide-react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

import { FollowButton } from '@components/ui/Buttons';
import { BookCover }    from '@components/book/BookCover';
import { BookInfo }     from '@components/book/BookInfo';

import { useRelativeTime }  from '@hooks/useRelativeTime';
import { usePostLike }      from '@hooks/usePostLike';
import { useComments }      from '@hooks/useComments';
import type { ClientPost }  from '@/src/types/posts';

interface Props {
  post: ClientPost;
  isProfile?: boolean;
}

// todo: adicionar o botão de editar/excluir post, se for o dono do post. dá pra usar o OptionsMenu
// todo: adicionar também isso nos comentários, mas talvez seja melhor separar os comentários em um componente próprio
// todo: o autor do post deve poder excluir comentários. o autor do comentário deve poder editar/excluir o próprio comentário
// todo: adicionar o botão de compartilhar post (com link para o post) e o botão de compartilhar livro (com link para o livro)
// todo: adicionar likes e replies em comentários
export function PostCard({ post, isProfile = false }: Props) {
  const { data: session, status } = useSession();
  const router = useRouter();

  const {
    liked,
    likeCount,
    loading: likeLoading,
    toggleLike,
  } = usePostLike(post.postId, post.likedByMe, post.likeCount);

  const {
    comments,
    loading: commentLoading,
    addComment,
  } = useComments(post.postId, post.comments);

  const [draft, setDraft] = useState('');
  const [showAllComments, setShowAllComments] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const displayedComments = showAllComments ? comments : comments.slice(0, 3); // ? considerar se 3 é um bom número padrão

  const handleToggleLike = useCallback(() => {
    if (status !== 'authenticated') {
      router.push('/signin');
    } else {
      toggleLike();
    }
  }, [status, router, toggleLike]);

  const handleComment = useCallback(() => {
    const text = draft.trim();
    if (!text) return inputRef.current?.focus();
    addComment(text);
    setDraft('');
    inputRef.current?.focus();
  }, [draft, addComment]);

  return (
    <article className="border-b border-[var(--border-base)]">
      <div className="flex flex-col md:flex-row p-4">
        <div className="flex flex-row gap-4 basis-4/7 border-r border-[var(--border-base)]">
          <BookCover
            src={post.book.coverUrl}
            alt={`Capa: ${post.book.title}`}
            width={120}
            height={180}
            href={`/books/${post.book.isbn}`}
            addable
          />
          <BookInfo
            book={{
              ...post.book,
              publisher: post.book.publisher ?? 'Desconhecida',
              edition: post.book.edition ?? 1,
              pages: post.book.pages ?? 0,
              language: post.book.language ?? 'pt',
              publicationDate: post.book.publicationDate
                ? new Date(post.book.publicationDate)
                : new Date(),
              coverUrl: post.book.coverUrl,
            }}
            className="mt-2 space-y-2"
            showPublicationDate
            strongIsbnLabel
          />
        </div>

        <div className="flex flex-col basis-3/7 ml-4">
          <header className="flex items-center justify-between pb-4">
            <div className="flex items-center gap-3">
              <Link href={`/profile/${post.author.username}`}>
                <Image
                  src={post.author.avatarUrl}
                  alt={post.author.name}
                  width={40}
                  height={40}
                  className="rounded-full"
                />
              </Link>
              <div>
                <Link
                  href={`/profile/${post.author.username}`}
                  className="font-semibold hover:underline"
                >
                  {post.author.name}
                </Link>
                <time className="block text-xs text-[var(--text-secondary)]">
                  {useRelativeTime(post.createdAt)}
                </time>
              </div>
            </div>

            {session?.user.username !== post.author.username && !isProfile &&(
              <FollowButton
                targetUsername={post.author.username}
                initialFollowing={post.isFollowingAuthor}
                size="sm"
              />
            )}
          </header>

          <p className="text-sm">{post.excerpt}</p>

          <div className="mt-auto">
            <div className="flex items-center gap-2">
              <div className="flex-1 w-full h-4 bg-[var(--color-secondary)] dark:bg-[var(--neutral-600)] border border-[var(--border-base)] rounded overflow-hidden">
                <div
                  className="h-full bg-[var(--color-primary)] dark:bg-[var(--neutral-400)]"
                  style={{ width: `${post.progress}%` }}
                />
              </div>
              <strong className="text-sm">{post.progress}% lido</strong>
            </div>
          </div>
        </div>
      </div>

      <div className="flex items-center border-y border-[var(--border-base)] gap-4 px-4 py-2">
        <button
          onClick={handleToggleLike}
          disabled={likeLoading}
          className="flex items-center gap-1"
        >
          <Heart
            className={clsx(
              'cursor-pointer transition-colors',
              liked && '[var(--text-primary)] fill-current'
            )}
          />
          <span>{likeCount}</span>
        </button>

        <button
          onClick={handleComment}
          disabled={commentLoading}
          className="flex items-center gap-1"
          title="Enviar comentário"
        >
          <MessageCircle />
          <span>{comments.length}</span>
        </button>

        <input
          ref={inputRef}
          type="text"
          placeholder="Escreva um comentário…"
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleComment()}
          className="flex-1 border border-[var(--border-subtle)] rounded-md py-1 px-2"
        />
      </div>

      { /* Renderiza os comentários */}
      <div className="px-4 py-2 space-y-3">
        {displayedComments.length > 0 ? (
          displayedComments.map((c) => (
            <div key={c.id} className="flex items-center gap-2">
              <Image
                src={c.author.avatarUrl || '/assets/images/users/default.jpg'}
                alt={c.author.name ?? 'Usuário'}
                width={26}
                height={26}
                className="rounded-full"
              />
              <div className="flex-1 text-sm">
                <Link href={`/profile/${c.author.username}`}>
                  <strong>{c.author.name ?? c.author.username}:</strong> {c.content}
                </Link>
              </div>
              <time className="text-xs text-[var(--text-tertiary)]">
                {useRelativeTime(c.createdAt)}
              </time>
            </div>
          ))
        ) : (
          <p className="italic text-[var(--text-tertiary)] text-center">
            Ainda não há comentários. Seja o primeiro!
          </p>
        )}

        {comments.length > 3 && !showAllComments && (
          <button
            className="text-sm text-[var(--text-primary)] hover:underline block mx-auto"
            onClick={() => setShowAllComments(true)}
          >
            <strong>Ver mais comentários ({comments.length - 3})</strong>
          </button>
        )}
        {showAllComments && (
          <button
            className="text-sm text-[var(--text-primary)] hover:underline block mx-auto"
            onClick={() => setShowAllComments(false)}
          >
            <strong>Exibir menos</strong>
          </button>
        )}
      </div>
    </article>
  );
}

export function PostCardSkeleton() {
  return (
    <article className="max-w-[700px] border-b border-[var(--border-base)] animate-pulse">
      <div className="flex flex-col md:flex-row p-4 gap-4">
        <div className="flex gap-4 basis-4/7">
          <div className="bg-[var(--surface-card)] border border-[var(--border-base)] rounded w-[120px] h-[180px]" />
          <div className="flex flex-col flex-1 space-y-2">
            <div className="h-6 w-2/3 bg-[var(--surface-card)] rounded" />
            <div className="h-4 w-1/2 bg-[var(--surface-card)] rounded" />
            <div className="h-4 w-1/3 bg-[var(--surface-card)] rounded" />
          </div>
        </div>

        <div className="flex flex-col basis-3/7 space-y-4">
          <div className="h-4 w-1/2 bg-[var(--surface-card)] rounded" />
          <div className="h-24 bg-[var(--surface-card)] rounded" />
          <div className="h-4 w-1/3 bg-[var(--surface-card)] rounded self-end" />
        </div>
      </div>

      <div className="flex items-center gap-4 border-t border-[var(--border-base)] p-4">
        <div className="h-6 w-6 bg-[var(--surface-card)] rounded-full" />
        <div className="h-4 w-10 bg-[var(--surface-card)] rounded" />
        <div className="flex-1 h-8 bg-[var(--surface-card)] rounded" />
      </div>

      <div className="px-4 py-2 space-y-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="flex items-center gap-2">
            <div className="h-6 w-6 bg-[var(--surface-card)] rounded-full" />
            <div className="h-4 w-3/4 bg-[var(--surface-card)] rounded" />
          </div>
        ))}
      </div>
    </article>
  );
}
