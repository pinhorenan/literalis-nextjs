// File: src/components/book/BookInfo.tsx
'use client';

import type { Book } from '@prisma/client';
import clsx from 'clsx';

interface BookInfoProps {
  book: Book;
  showPublicationDate?: boolean;
  strongIsbnLabel?: boolean;
  className?: string;
}

export default function BookInfo({
  book,
  showPublicationDate = false,
  strongIsbnLabel = false,
  className,
}: BookInfoProps) {
  const publicationDateFormatted = showPublicationDate
    ? new Intl.DateTimeFormat('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
      }).format(new Date(book.publicationDate))
    : null;

  return (
    <div className={clsx('flex flex-col gap-1', className)}>
      <h3 className="text-lg font-semibold">{book.title}</h3>
      <p className="text-sm text-[var(--text-secondary)]">por {book.author}</p>
      <p className="text-xs text-[var(--text-tertiary)]">
        {book.publisher}, ed. {book.edition}
      </p>

      {showPublicationDate && publicationDateFormatted && (
        <p className="text-xs text-[var(--text-tertiary)]">
          Publicado em {publicationDateFormatted}
        </p>
      )}

      <p className="text-sm">
        {book.pages} páginas • {book.language}
      </p>

      <p className="text-sm">
        {strongIsbnLabel ? (
          <>
            <strong>ISBN:</strong> {book.isbn}
          </>
        ) : (
          <>ISBN: {book.isbn}</>
        )}
      </p>
    </div>
  );
}

export function BookInfoSkeleton({ className = '' }: { className?: string }) {
  return (
    <div className={clsx('flex flex-col gap-2', className)}>
      <div className="h-6 w-3/4 bg-[var(--surface-card)] rounded animate-pulse" />
      <div className="h-4 w-1/2 bg-[var(--surface-card)] rounded animate-pulse" />
      <div className="h-4 w-1/3 bg-[var(--surface-card)] rounded animate-pulse" />
      <div className="h-4 w-1/4 bg-[var(--surface-card)] rounded animate-pulse" />
    </div>
  );
}
