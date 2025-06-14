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
import { PostComments } from '@components/post/PostComments';

import { useRelativeTime }  from '@hooks/useRelativeTime';
import { usePostLike }      from '@hooks/usePostLike';
import { useComments }      from '@hooks/useComments';
import type { ClientPost }  from '@/src/types/posts';

interface Props {
  post: ClientPost;
  isProfile?: boolean;
  onFollowChange?: (nowFollowing: boolean) => void;
}

// todo: adicionar o botão de editar/excluir post, se for o dono do post. dá pra usar o OptionsMenu
// todo: adicionar também isso nos comentários, mas talvez seja melhor separar os comentários em um componente próprio
// todo: o autor do post deve poder excluir comentários. o autor do comentário deve poder editar/excluir o próprio comentário
// todo: adicionar o botão de compartilhar post (com link para o post) e o botão de compartilhar livro (com link para o livro)
// todo: adicionar likes e replies em comentários
export function PostCard({ post, isProfile = false, onFollowChange }: Props) {
  const { data: session, status } = useSession();
  const [draft, setDraft] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  const { liked, likeCount, loading: likeLoading, toggleLike } = usePostLike(post.id, post.likedByMe, post.likeCount);

  const { comments, loading: commentLoading, addComment } = useComments(post.id, post.comments);


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
        <div className="flex flex-col gap-4 p-4 md:flex-row md:gap-6">
          {/* Livro e info */}
          <div className="flex flex-row gap-4 md:basis-1/2 md:border-r border-[var(--border-base)]">
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

          {/* Autor e progresso */}
          <div className="flex flex-col gap-2 md:basis-1/2 md:ml-4">
            <div className="flex items-center justify-between pb-2">
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
                  onToggle={onFollowChange}
                  size="sm"
                />
              )}
            </div>

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

        {/* Ações: like, comentar */}
        <div className="flex flex-row items-center border-y border-[var(--border-base)] gap-4 sm:gap-2 px-4 py-2">
          <div className="flex items-center gap-4">

          <button
            onClick={handleToggleLike}
            disabled={likeLoading}
            className="flex items-center gap-1 min-w-[40px] justify-center"
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
            className="flex items-center gap-1 min-w-[40px] justify-center"
            title="Enviar comentário"
          >
            <MessageCircle />
            <span>{comments.length}</span>
          </button>
          </div>

          <div className="flex-1 w-full">
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
        </div>

      <PostComments comments={comments} />
    </article>
  );
}
