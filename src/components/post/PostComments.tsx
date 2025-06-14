// File: src/components/post/PostComments.tsx
'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useRef, useState, useEffect } from 'react';
import { useRelativeTime } from '@hooks/useRelativeTime';
import type { ClientComment } from '@/src/types/posts';

export interface Props {
  comments: ClientComment[];
}

export function PostComments({ comments }: Props) {
  const [showAll, setShowAll] = useState(false);
  const [height, setHeight]   = useState(0);
  
  const fullRef = useRef<HTMLDivElement>(null);
  const limitedRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const newHeight = showAll
      ? fullRef.current?.scrollHeight
      : limitedRef.current?.scrollHeight;

    if (newHeight) {
      setHeight(newHeight);
    }
  }, [showAll, comments.length]);

  if (comments.length === 0) {
    return (
      <p className="italic text-sm text-[var(--text-tertiary)] text-center my-6">
        Nenhum comentário ainda. Seja o primeiro a comentar!
      </p>
    );
  }

  return (
    <div className="px-4 py-2 space-y-3">
      {/* Container c/ animação */}
      <div
        style={{
          maxHeight: `${height}px`,
          overflow: 'hidden',
          transition: 'max-height 0.4s ease-in-out',
        }}
      >

        {/* Lista completa */}
        <div ref={fullRef}>
          {comments.map((comment) => (
            <CommentItem key={comment.id} comment={comment} />
          ))}
        </div>

        {/* Lista reduzida invisível para medir altura */}
        <div
            ref={limitedRef}
            className="invisible absolute top-0 left-0 pointers-events-none h-auto"
            aria-hidden
        >
          {comments.slice(0, 3).map((comment) => (
            <CommentItem key={comment.id} comment={comment} />
          ))}
        </div>
      </div>

      {/* Botão de expandir/recolher */}
      {comments.length > 3 && (
        <button
          className="text-sm text-[var(--text-primary)] cursor-pointer hover:underline block mx-auto mt-2"
          onClick={() => setShowAll((s) => !s)}
        >
          <strong>
            {showAll
              ? 'Exibir menos'
              : `Ver mais comentários (${comments.length - 3})`}
          </strong>
        </button>
      )}
    </div>
  );
}

/* Componente reutilizável */
function CommentItem({
  comment,
}: {
  comment: ClientComment;
}) {
  return (
    <div className="flex items-start gap-3 mb-2">
      <Image
        src={comment.author.avatarUrl || '/assets/avatars/default.jpg'}
        alt={comment.author.name ?? 'Usuário'}
        width={28}
        height={28}
        className="rounded-full mt-0.5"
      />
      <div className="flex-1 text-sm space-y-1">
        <Link href={`/profile/${comment.author.username}`}>
          <strong>{comment.author.name}</strong>
        </Link>
        <p className="text-sm break-words">{comment.content}</p>
      </div>
      <time className="text-xs text-nowrap text-[var(--text-tertiary)] whitespace-nowrap">
        {useRelativeTime((comment.createdAt))}
      </time>
    </div>
  )
}