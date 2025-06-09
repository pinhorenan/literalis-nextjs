'use client';

import React, { useState, useEffect, useMemo } from 'react';
import clsx from 'clsx';
import { Button } from '@/src/components/ui/Buttons';
import BookCard from '@/src/components/book/BookCard';
import { SearchBar } from '@/src/components/search/SearchBar';
import type { Book } from '@prisma/client';
import { Grid, List, BookOpen }  from 'lucide-react';

interface BookWithInfo extends Book {
  coverPath: string;
}

export default function BookshelfPage() {
  const [books, setBooks] = useState<BookWithInfo[]>([]);
  const [filterText, setFilterText] = useState('');
  const [sortKey, setSortKey] = useState<'title' | 'author' | 'publicationDate'>('title');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  useEffect(() => {
    fetch('/api/bookshelf')
    .then(resp => resp.json())
    .then(data => setBooks(data))
    .catch(console.error);
  }, [])

  const displayed = useMemo(() => {
    return books
      .filter(book => 
        book.title.toLowerCase().includes(filterText.toLowerCase()) ||
        book.author.toLowerCase().includes(filterText.toLowerCase())
      )
      .sort((a, b) => {
        const va = a[sortKey], vb = b[sortKey];
        if (va < vb) return sortOrder === 'asc' ? -1 : 1;
        if (va > vb) return sortOrder === 'asc' ? 1 : -1;
        return 0;  
      });
  }, [books, filterText, sortKey, sortOrder])

  return (
    <section className="flex gap-4 overflow-x-hidden">
      <aside className="
        sticky top-[var(--size-header)] 
        w-[var(--size-sidebar)] h[calc(100vh_-_var(--size-header))] p-2 
        bg-[var(--surface-bg)] border-r border-[var(--color-border)] overflow-auto"
      >
        <h2 className="font-semibold mb-2 text-[var(--text-primary)]">Estante</h2>

        <div className="mb-4">
          <SearchBar
            value={filterText}
            onChange={setFilterText}
            onSearch={() => {}}
          />
        </div>

        <div className="mb-4">
          <h3 className="text-sm font-medium mb-1">Ordenar por</h3>
          <select
            className="w-full p-2 border rounded bg-[var(--surface-bg)]"
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
            className="mt-2"
            aria-label="Alterar ordem"
            onClick={() => setSortOrder(o => (o === 'asc' ? 'desc' : 'asc'))}
            icon={sortOrder === 'asc' ? Grid : List}
            />
        </div>

        {/* Controle de visualização */}
        <div>
          <h3 className="text-sm font-medium mb-1">Visualização</h3>
          <div className="flex gap-2">
            <Button
              variant="icon"
              aria-label="Grid view"
              icon={Grid}
              active={viewMode === 'grid'}
              onClick={() => setViewMode('grid')}
            />
            <Button
              variant="icon"
              aria-label="List view"
              icon={List}
              active={viewMode === 'list'}
              onClick={() => setViewMode('list')}
            />
          </div>
        </div>
      </aside>

      {/* Área principal com os livros */}
      <main
        className={clsx(
          'flex-1 overflow-auto p-4]',
          viewMode === 'grid' 
            ? 'grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4]'
            : 'flex flex-col gap-4]'
        )}
      >
        {displayed.map(book => (
          viewMode === 'grid' ? (
            <BookCard key={book.isbn} book={book} />
          ) : (
            // listagem compacta
            <div
              key={book.isbn}
              className="flex items-center gap-4 p-4 border rounded bg-[var(--surface-bg)]"
            >
              <img 
                src={book.coverPath} 
                alt={book.title}
                className="w-16 h-24 object-cover rounded"
              />
              <div className="flex-1 min-w-0">
                <h4 className="font-semibold truncate">{book.title}</h4>
                <p className="text-sm text-[var(--text-tertiary)] truncate">
                  {book.author} &ndash; {book.publisher}, {book.edition}
                </p>
              </div>
              <Button
                variant="icon"
                aria-label="Ver detalhes"
                icon={BookOpen}
                onClick={() => {}}
              />
            </div>
          )
        ))}

        {displayed.length === 0 && (
          <p className="text-center text-[var(--text-secondary)]">
            Nenhum livro encontrado.
          </p>
        )}
      </main>
    </section>
  )
}