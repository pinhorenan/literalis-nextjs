// components/book/BookInfo.tsx
'use client';

import type { Book } from '@prisma/client';
import clsx from 'clsx';

interface BookInfoProps {
    book: Book;
    /** Exibe a data e publicação */
    showPublicationDate?: boolean;
    /** Se true, renderiza <strong>ISBN:</strong> em vez de "ISBN-10:" */
    strongIsbnLabel?: boolean;
    className?: string;
}

export function BookInfo({
    book,
    showPublicationDate = false,
    strongIsbnLabel = false,
    className,
}: BookInfoProps) {
    return (
        <div className={clsx('flex flex-col', className)}>
            <h3 className="text-lg font-semibold">{book.title}</h3>
            <p className="text-sm text-[var(--text-secondary)]">por {book.author}</p>
            <p className="text-xs text-[var(--text-tertiary)]">{book.publisher}, ed. {book.edition}</p>
            {showPublicationDate && (
                <p className="text-xs text-[var(--text-tertiary)]">Publicado em {new Date(book.publicationDate).toLocaleDateString()}</p>
            )}
            <p className="text-sm">
                {strongIsbnLabel ? (<><strong>ISBN:</strong> {book.isbn}</>) : (<>ISBN-10: {book.isbn}</>)}
            </p>
        </div>
    );
}