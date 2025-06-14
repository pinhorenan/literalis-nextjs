// File: src/components/shelf/ShelfItem.tsx
'use client';

import { useRef }       from 'react';
import { BookCard  }    from '@components/book/BookCard';
import { BookCover }    from '@components/book/BookCover';
import { OptionsMenu }  from '@components/ui/OptionsMenu';
import type { ShelfItem as ShelfItemType } from '@components/shelf/BookshelfClient';

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
    className
}: ShelfItemProps) {
    const { book, progress } = item;
    const menuRef = useRef<HTMLDivElement>(null);

    // grid: mostra a capa + menu no canto
    if (viewMode === 'grid') {
        return (
            <div className="relative group w-fit">
                <BookCover 
                    src={book.coverPath} 
                    alt={book.title}
                    width={240}
                    height={360} 
                    className="w-full h-auto" 
                />
                
                {isOwner && (
                    <div className="absolute top-1 right-1 z-10 opacity-0 group-hover:opacity-100 transition-opacity" ref={menuRef}>
                        <OptionsMenu
                            onEdit={() => onEdit(book.isbn, progress)}
                            onDelete={() => onDelete(book.isbn)}
                        />
                    </div>
                )}
            </div>
        );
    }

    // list: mostra capa, infos, botão detalhes e menu
    return (
        <div className="relative flex items-center">
            <BookCard book={book} />
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