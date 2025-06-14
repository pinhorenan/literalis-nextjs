// File: src/components/shelf/BookshelfClient.tsx
'use client';

import { useState, useMemo } from 'react';
import clsx from 'clsx';
import { SearchBar } from '@components/search/SearchBar';
import { Button } from '@components/ui/Buttons';
import { Grid, List, SortAsc, SortDesc } from 'lucide-react';
import ShelfItem from '@components/shelf/ShelfItem';
import type { Book } from '@prisma/client';

export interface ShelfItem {
    book: Book;
    progress: number;
    addedAt: string;
}

interface BookshelfClientProps {
    initialItems: ShelfItem[];
    username: string
    isOwner: boolean;
}

export default function BookshelfClient({ 
    initialItems, 
    username,
    isOwner
}: BookshelfClientProps) {
    const [items, setItems]             = useState<ShelfItem[]>(initialItems);
    const [filterText, setFilterText]   = useState('');
    const [sortKey, setSortKey]         = useState<'title' | 'author' | 'publicationDate'>('title');
    const [sortOrder, setSortOrder]     = useState<'asc' | 'desc'>('asc');
    const [viewMode, setViewMode]       = useState<'grid' | 'list'>('grid');

    const updateProgress = async (isbn: string, old: number) => {
        const input = prompt('Novo progresso (0-100):', old.toString()); // todo: melhorar ne
        if (!input) return;
        const prog = Math.max(0, Math.min(100, parseInt(input, 10)));
        if (isNaN(prog)) return;
        await fetch(`/api/users/${username}/shelf/${isbn}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ progress: prog }),
        });
        setItems(lst => lst.map(i => 
            i.book.isbn === isbn ? { ...i, progress: prog } : i
        ));
    };

    const removeFromShelf = async (isbn: string) =>{
        if (!confirm('Remover estelivro da sua estante?')) return; // todo melhorar ne
        await fetch(`/api/users/${username}/shelf/${isbn}`, { method: 'DELETE' });
        setItems(lst => lst.filter(i => i.book.isbn !== isbn));
    }

    const displayed = useMemo(() =>
      items
        .filter(({ book }) =>
          book.title.toLowerCase().includes(filterText.toLowerCase()) ||
          book.author.toLowerCase().includes(filterText.toLowerCase())
        )
        .sort((a, b) => {
          const va = a.book[sortKey], vb = b.book[sortKey];
          if (va < vb) return sortOrder === 'asc' ? -1 : 1;
          if (va > vb) return sortOrder === 'asc' ? 1 : -1;
          return 0;
        })
    , [items, filterText, sortKey, sortOrder]);


    return (
        <section className="w-full h-full space-y-6">
            {/* controles */}
            <div className="flex items-center gap-4 mb-4">
                <SearchBar
                    value={filterText}
                    onChange={setFilterText}
                    placeholder="Buscar na estante..."
                />

                <div className="flex items-center gap-2">
                    <label className="text-sm font-medium">Ordenar por:</label>
                    <select
                        className="border border-[var(--border-base)] rounded p-1 text-sm bg-[var(--surface-bg)] focus:outline-none"
                        value={sortKey}
                        onChange={e => setSortKey(e.target.value as any)}
                    >
                        <option value="title">Título</option>
                        <option value="author">Autor</option>
                        <option value="publicationDate">Data de publicação</option>
                    </select>
                    <Button
                        variant="icon"
                        size="sm"
                        aria-label="Inverter ordem"
                        onClick={() => setSortOrder(o => o === 'asc' ? 'desc' : 'asc')}
                        icon={sortOrder === 'asc' ? SortAsc : SortDesc}
                    />
                </div>

                <div className="flex items-center gap-2 ml-auto">
                    <Button
                        variant="icon"
                        size="sm"
                        active={viewMode === 'grid'}
                        aria-label="Ver em grade"
                        onClick={() => setViewMode('grid')}
                        icon={Grid}
                        className="active:fill-transparent"
                    />
                    <Button
                        variant="icon"
                        size="sm"
                        active={viewMode === 'list'}
                        aria-label="Ver em lista"
                        onClick={() => setViewMode('list')}
                        icon={List}
                        className="active:fill-transparent"
                    />
                </div>
            </div>

            {/* Itens */}
            <div className={clsx(
                viewMode === 'grid'
                    ? 'grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-4'
                    : 'flex flex-col space-y-4'
            )}>
                {displayed.map(item => (
                    <ShelfItem
                        key={item.book.isbn}
                        item={item}
                        viewMode={viewMode}
                        isOwner={isOwner}
                        onEdit={updateProgress}
                        onDelete={removeFromShelf}
                    />
                ))}
            </div>

            {displayed.length === 0 && (
                <p className="text-center text-[var(--text-secondary)]">
                    Nenhum livro encontrado.
                </p>
            )}
        </section>
    );
}