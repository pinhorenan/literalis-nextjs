// File: src/components/bookshelf/BookShelfItem.tsx
'use client';

import { useRef }       from 'react';
import OptionsMenu      from '@components/ui/OptionsMenu';
import BookCover        from '@components/book/BookCover';
import BookInfo         from '@components/book/BookInfo';
import type { Book }    from '@prisma/client';


export interface ShelfItemType {
    book: Book;
    progress: number;
    addedAt: string;
}

interface ShelfItemProps {
    item: ShelfItemType;
    viewMode: 'grid' | 'list';
    isOwner: boolean;
    onEdit: (isbn: string, oldProgress: number) => void;
    onDelete: (isbn: string) => void;
    className?: string;
}

export default function ShelfItem({
    item,
    viewMode,
    isOwner,
    onEdit,
    onDelete,
    className = '',
}: ShelfItemProps) {
    const { book, progress } = item;
    const menuRef = useRef<HTMLDivElement>(null);

    if (viewMode === 'grid') {
        return (
            <div className={`relative group w-full max-w-[180px] mx-auto ${className}`}>
                <BookCover 
                    src={book.coverUrl} 
                    alt={book.title}
                    width={180} 
                    className="w-full h-auto rounded border border-[var(--border-base)] transition-transform transform group-hover:scale-105" 
                />

                <div className="absolute bottom-2 left-2 right-2 text-center">
                    <div className="w-full h-3 rounded bg-black/30 border border-white/20 overflow-hidden">
                        <div
                            className="h-full bg-[var(--color-primary)] transition-all duration-300"
                            style={{ width: `${progress}%` }}
                        />
                    </div>
                </div>
                
                {isOwner && (
                    <div
                        ref={menuRef} 
                        className="absolute top-1 right-1 z-10 opacity-50 group-hover:opacity-100 transition-opacity"
                    >
                        <OptionsMenu
                            onEdit={() => onEdit(book.isbn, progress)}
                            onDelete={() => onDelete(book.isbn)}
                        />
                    </div>
                )}
            </div>
        );
    }

    return (
        <div className={`relative flex items-center px-2 py-1 rounded-md bg-[var(--surface-card)] hover:bg-[var(--surface-card-hover)] transition ${className}`}>
            
            <div className="flex items-center gap-3 flex-1 p-2">
                <BookCover
                    src={book.coverUrl}
                    alt={book.title}
                    width={180}
                    className="h-auto rounded border border-[var(--border-base)]"
                />
                <div className="mt-6 mb-auto ml-3 flex-1 space-y-4">
                    <BookInfo book={book}  />
                    <div className="ml-auto text-sm text-[var(--text-secondary)]">
                        {progress}%
                    </div>
                </div>
            </div>

            {isOwner && (
                <div ref={menuRef} className="absolute top-3 right-1 z-10">
                    <OptionsMenu
                        onEdit={() => onEdit(book.isbn, progress)}
                        onDelete={() => onDelete(book.isbn)}
                    />
                </div>
            )}
        </div>
    )
}