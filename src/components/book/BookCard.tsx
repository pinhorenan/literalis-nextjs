import Image from 'next/image';
import type { Book } from '@prisma/client';

export default function BookCard({ book }: { book: Book }) {
    return (
        <div className="
            flex gap-5 p-4 rounded-md border border-[var(--border-base)]
            bg-[var(--surface-card)] hover:bg-[var(--surface-card-hover)]
            transition-colors
        ">
            <Image
                src={book.coverPath}
                alt={`Capa: ${book.title}`}
                width={120}
                height={180}
                className="rounded object-cover"
            />

            <div className="flex flex-col gap-1">
                <h3 className="text-lg font-semibol">{book.title}</h3>
                <p className="text-sm text-[var(--text-secondary)]">por {book.author}</p>
                <p className="text-xs text-[var(--text-tertiary)]">
                    {book.publisher}, edição {book.edition}
                </p>
                <p className="text-sm">{book.pages} páginas &ndash; {book.language}</p>
                <p className="text-sm">ISBN-10: {book.isbn}</p>
            </div>
        </div>
    )
}