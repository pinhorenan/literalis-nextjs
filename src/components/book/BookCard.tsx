// File: src/components/book/BookCard.tsx
'use client';

import BookCover, { BookCoverSkeleton } from '@components/book/BookCover';
import BookInfo,  { BookInfoSkeleton  } from '@components/book/BookInfo';
import type { Book } from '@prisma/client';

export default function BookCard({ book }: { book: Book }) {
  return (
    <div
      className="
        flex gap-5 p-4 w-full h-full rounded-md border border-[var(--border-base)]
        bg-[var(--surface-card)] hover:bg-[var(--surface-card-hover)]
        transition-colors
      "
    >
      <BookCover
        src={book.coverUrl}
        alt={`Capa: ${book.title}`}
        width={120}
        height={180}
        href={`/books/${book.isbn}`}
      />

      <BookInfo
        book={book}
        className="gap-1"
      />
    </div>
  );
}

export function BookCardSkeleton() {
  return (
    <div
      className="
        flex gap-5 p-4 rounded-md border border-[var(--border-base)]
        bg-[var(--surface-card)]
      "
    >
      <BookCoverSkeleton width={120} height={180} />
      <BookInfoSkeleton className="flex-1" />
    </div>
  );
}

export function BookCardCompact({ book }: { book: Book }) {
  return (
    <div
      className="
        flex items-center gap-2 p-2 rounded-md
        hover:bg-[var(--surface-card-hover)] transition-colors
      "
    >
      <BookCover
        src={book.coverUrl}
        alt={`Capa: ${book.title}`}
        width={80}
        height={120}
        href={`/books/${book.isbn}`}
      />
      <BookInfo
        book={book}
        className="overflow-hidden"
      />
    </div>
  );
}

export function BookCardCompactSkeleton() {
  return (
    <div
      className="
        flex items-center gap-2 p-2 rounded-md
        bg-[var(--surface-card)] animate-pulse
      "
    >
      <BookCoverSkeleton width={80} height={120} />
      <div className="flex-1">
        <div className="h-4 w-2/3 bg-[var(--surface-card)] rounded mb-2 animate-pulse" />
        <div className="h-4 w-1/3 bg-[var(--surface-card)] rounded animate-pulse" />
      </div>
    </div>
  );
}

export function BookCardMini({ book }: { book: Book }) {
  return (
    <BookCover
      src={book.coverUrl}
      alt={book.title}
      width={60}
      height={90}
      href={`/books/${book.isbn}`}
    />
  );
}
