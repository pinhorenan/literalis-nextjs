// File: src/components/bookshelf/BookshelfClient.tsx
'use client';

import clsx from 'clsx';
import { 
    Grid, 
    List, 
    SortAsc, 
    SortDesc 
} from 'lucide-react';
import { useState, useMemo } from 'react';
import { Button } from '@components/ui/Buttons';
import SearchBar from '@components/ui/SearchBar';
import ShelfItem, {type ShelfItemType} from '@components/bookshelf/BookShelfItem';

interface BookshelfClientProps {
    initialItems: ShelfItemType[];
    username: string
    isOwner: boolean;
}

export default function BookshelfClient({ 
    initialItems, 
    username,
    isOwner
}: BookshelfClientProps) {
    const [items, setItems]             = useState<ShelfItemType[]>(initialItems);
    const [filterText, setFilterText]   = useState('');
    const [sortKey, setSortKey]         = useState<'title' | 'author' | 'progress' |'publicationDate'>('title');
    const [sortOrder, setSortOrder]     = useState<'asc' | 'desc'>('asc');
    const [viewMode, setViewMode]       = useState<'grid' | 'list'>('grid');

    const updateProgress = async (isbn: string, old: number) => {
        const input = prompt('Novo progresso (0-100):', old.toString()) // TODO: melhorar, não usar prompt
        if (!input) return;
        const prog = Math.max(0, Math.min(100, parseInt(input, 10)));
        if (isNaN(prog)) return;
        await fetch(`/api/users/${username}/bookshelf/${isbn}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ progress: prog }),
        });
        setItems(lst => lst.map(i => 
            i.book.isbn === isbn ? { ...i, progress: prog } : i
        ));
    };

    const removeFromShelf = async (isbn: string) =>{
        if (!confirm('Remover estelivro da sua estante?')) return; // TODO: melhorar, não usar confirm
        await fetch(`/api/users/${username}/bookshelf/${isbn}`, { method: 'DELETE' });
        setItems(lst => lst.filter(i => i.book.isbn !== isbn));
    };

    const displayed = useMemo(() =>
      items
        .filter(({ book }) =>
          book.title.toLowerCase().includes(filterText.toLowerCase()) ||
          book.author.toLowerCase().includes(filterText.toLowerCase())
        )
        .sort((a, b) => {
          const va = sortKey === 'progress' ?a.progress : a.book[sortKey];
          const vb = sortKey === 'progress' ?b.progress : b.book[sortKey];
          if (va < vb) return sortOrder === 'asc' ? -1 : 1;
          if (va > vb) return sortOrder === 'asc' ? 1 : -1;
          return 0;
        })
    , [items, filterText, sortKey, sortOrder]);


    return (
        <section className="w-full h-full space-y-6">
            {/* Barra de Controler */}
            <div className="flex flex-col justify-between sm:flex-row sm:items-center gap-4 mb-4">
                <SearchBar
                    value={filterText}
                    onChange={setFilterText}
                    placeholder="Buscar na estante..."
                />

                <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                        <label className="text-sm font-medium">Ordenar:</label>
                        <select
                            className="border border-[var(--border-base)] rounded p-1 text-sm bg-[var(--surface-bg)] focus:outline-none"
                            value={sortKey}
                            onChange={e => setSortKey(e.target.value as any)}
                        >
                            <option value="title">Título</option>
                            <option value="author">Autor</option>
                            <option value="progress">Progresso</option>
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
                    <div className="flex items-center gap-2 sm:ml-auto justify-end">
                        <Button
                            variant="icon"
                            size="sm"
                            active={viewMode === 'grid'}
                            aria-label="Ver em grade"
                            onClick={() => setViewMode('grid')}
                            icon={Grid}
                        />
                        <Button
                            variant="icon"
                            size="sm"
                            active={viewMode === 'list'}
                            aria-label="Ver em lista"
                            onClick={() => setViewMode('list')}
                            icon={List}
                        />
                    </div>
                </div>
            </div>

            {/* Lista de Livros */}
            <div className={clsx(
                viewMode === 'grid'
                    ? 'grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4'
                    : 'flex flex-col gap-4'
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