// components/feed/PostCard.tsx
'use client';

import { useEffect, useRef, useState }    from 'react';
import { Heart, MessageCircle }           from 'lucide-react';
import { useSession }                     from 'next-auth/react';
import { useRouter }                      from 'next/navigation';

import { Button }       from '@components/ui/Buttons';
import { relativeTime } from '@hooks/relativeTime';

import Image from 'next/image';
import Link from  'next/link';
import clsx from  'clsx';

import type { Post, User, Book, Comment } from '@prisma/client';
import { BookCover } from '../book/BookCover';
import { BookInfo } from '../book/BookInfo';

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
  const inputRef = useRef<HTMLInputElement>(null);
  const [liked, setLiked] = useState<boolean>(false);
  const [likeCount, setLikeCount] = useState<number>(post.reactionsCount);
  const [following, setFollowing] = useState<boolean>(false);
  const [draft, setDraft] = useState<string>('');
  const [showAllComments, setShowAllComments] = useState(false);
  
  const displayedComments = showAllComments ? post.comments : post.comments.slice(0, 3);

  /* ------------------------------------------------------------
   *  SYNC LIKE / FOLLOW STATUS
   * ------------------------------------------------------------ */
  useEffect(() => {
    if (status !== 'authenticated') return;
    (async () => {
      try {
        const [likeRes, followRes] = await Promise.all([
          fetch(`/api/posts/${post.id}/like/likes/me`),
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

  return (
    <article className=" overflow-hidden max-w-[700px] border-b border-[var(--border-base)]">
      <div className="flex flex-col md:flex-row p-4">
        <div className="flex flex-row gap-4 basis-4/7 border-r border-[var(--border-base)]" >
          <BookCover
            src={post.book.coverPath}
            alt={`Capa: ${post.book.title}`}
            width={120}
            height={180}
            href={`/books/${post.book.isbn}`}
          />
          <BookInfo
            book={post.book}
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
                  src={post.author.avatarPath || '/assets/images/users/default.jpg'}
                  alt={post.author.name}
                  width={40}
                  height={40}
                  className="rounded-full"
                />
              </Link>
              <div>
                <Link href={`/profile/${post.author.username}`} className="font-semibold hover:underline">
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

          <p className="text-sm">{post.excerpt}</p>

          <div className="mt-auto">
              <div className="flex flex-1 flex-row items-center gap-2">
                <div className="flex-1 w-full h-4 bg-[var(--color-secondary)] dark:bg-[var(--neutral-600)] border border-[var(--border-base)] rounded overflow-hidden">
                  <div
                    className="h-full bg-[var(--color-primary)] dark:bg-[var(--neutral-400)]"
                    style={{ width: `${post.progressPct}%` }}
                  />
                </div>
                <strong className="text-sm">{post.progressPct}% lido</strong>
              </div>
            </div>
        </div>
      </div>

      {/* IMAGE */}
      {/* reacts + input comentário */}
        <div className="flex items-center border-y border-[var(--border-base)] gap-4 px-4 py-2">
          <button onClick={toggleLike} className="flex items-center gap-1">
            <Heart className={clsx('cursor-pointer transition-colors', liked && '[var(--text-primary)] fill-current')} />
            <span>{likeCount}</span>
          </button>

          <button onClick={handleComment} className="flex items-center gap-1 " title="Enviar comentário">
            <MessageCircle/>
            <span>{post.commentsCount}</span>
          </button>

          <input
            ref={inputRef}
            type="text"
            placeholder="Escreva um comentário…"
            value={draft}
            onChange={e => setDraft(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleComment()}
            className="flex-1 border border-[var(--border-subtle)] rounded-md py-1 px-2"
          />
        </div>

      {/* COMMENTS + LIKE / SEND */}
      <div className="px-4 py-2 space-y-3">
        {displayedComments.length ? (
          displayedComments.map(c => (
            <div key={c.id} className="flex items-center gap-2">
              <Image
                src={c.author.avatarPath || '/assets/avatar_placeholder.svg'}
                alt={c.author.name}
                width={26}
                height={26}
                className="rounded-full"
              />
              <div className="flex-1">
                <p className="text-sm">
                  <strong>{c.author.name}:</strong> {c.text} 
                </p>
              </div>
              <time className="relative right-0 text-xs text-[var(--text-tertiary)]">
                    {relativeTime(c.createdAt)}
                  </time>
            </div>
          ))
        ) : (
          <p className="italic text-[var(--text-tertiary)] text-center">
            Ainda não há comentários. Seja o primeiro!
          </p>
        )}

        {post.comments.length > 2 && !showAllComments && (
          <button
            className="text-sm text-[var(--text-primary)] hover:cursor-pointer hover:underline block text-left mx-auto"
            onClick={() => setShowAllComments(true)}
          >
            <strong>Ver mais comentários ({post.comments.length - 3})</strong>
          </button>
        )}

        {showAllComments && (
          <button
            className="text-sm text-[var(--text-primary)] hover:cursor-pointer hover:underline block text-left mx-auto"
            onClick={() => setShowAllComments(false)}
          >
            <strong>Exibir menos</strong>
          </button>
        )}
      </div>
    </article>
  );
}
