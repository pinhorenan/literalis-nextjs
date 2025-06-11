// components/book/BookCard.tsx

import type { Book } from '@prisma/client';
import { BookCover } from '@components/book/BookCover';
import { BookInfo } from '@components/book/BookInfo';

export function BookCard({ book }: { book: Book }) {
    return (
      <div
        className="
          flex gap-5 p-4 rounded-md border border-[var(--border-base)]
          bg-[var(--surface-card)] hover:bg-[var(--surface-card-hover)]
          transition-colors
          "
      >
        <BookCover
          src={book.coverPath}
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

  export function BookCardCompact({ book }: { book: Book }) {
    return (
      <div className="flex items-center gap-2 p-2 rounded-md hover:bg-[var(--surface-card-hover)] transition-colors">
        <BookCover
          src={book.coverPath}
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

  export function BookCardMini({ book }: { book: Book }) {
    return (
      <BookCover
        src={book.coverPath}
        alt={book.title}
        width={60}
        height={90}
        href={`/books/${book.isbn}`}
      />
    );
  }