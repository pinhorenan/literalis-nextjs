// app/profile/[username]/shelf/page.tsx
'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import clsx from 'clsx';
import { useSession } from 'next-auth/react';
import { Button } from '@components/ui/Buttons';
import { SearchBar } from '@components/ui/SearchBar';
import { BookCard } from '@components/book/BookCard';
import { Grid, List, BookOpen }  from 'lucide-react';
import type { Book } from '@prisma/client';

interface BookWithInfo extends Book {
  coverPath: string;
}

export default function BookshelfPage() {
  const { data: session } = useSession();
  const username = session?.user?.username;
  const [books, setBooks] =           useState<BookWithInfo[]>([]);
  const [filterText, setFilterText] = useState('');
  const [sortKey, setSortKey] =       useState<'title' | 'author' | 'publicationDate'>('title');
  const [sortOrder, setSortOrder] =   useState<'asc' | 'desc'>('asc');
  const [viewMode, setViewMode] =     useState<'grid' | 'list'>('grid');

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
      <aside className=" sticky top-[var(--size-header)] w-[var(--size-sidebar)] h[calc(100vh_-_var(--size-header))] p-2 bg-[var(--surface-bg)] border-r border-[var(--color-border)] overflow-auto">
        <SearchBar
          value={filterText}
          onChange={setFilterText}
          onSearch={() => {}}
        />
        <div className="mt-4">
          <h3 className="text-sm font-medium">Ordenar por</h3>
          <select
            className="w-full p-2 mt-1 border rounded"
            value={sortKey}
            onChange={e => setSortKey(e.target.value as any)}
          >
            <option value="title">Título</option>
            <option value="author">Autor</option>
            <option value="publicationDate">Data</option>
          </select>
          <Button
            variant="icon"
            size="sm"
            className="mt-2"
            aria-label="Inverter ordem"
            onClick={() => setSortOrder(o => o === 'asc' ? 'desc' : 'asc')}
            icon={sortOrder === 'asc' ? Grid : List}
          />
        </div>

        <div className="mt-6">
          <h3 className="text-sm font-medium">Visualização</h3>
          <div className="flex gap-2 mt-1">
            <Button
              variant="icon"
              size="sm"
              active={viewMode === "grid"}
              aria-label="Grid"
              icon={Grid}
              onClick={() => setViewMode('grid')}
            />
            <Button
              variant="icon"
              size="sm"
              active={viewMode === "list"}
              aria-label="List"
              icon={List}
              onClick={() => setViewMode('list')}
            />
          </div>
        </div>
      </aside>

      {/* Área principal com os livros */}
      <main
        className={clsx(
          'flex-1 overflow-auto p-4',
          viewMode === 'grid'
            ? 'grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4'
            : 'flex flex-col gap-4'
        )}
      >
       {displayed.map(book => (
        <div key={book.isbn} className="relative group rounded">
          {/* Card normal */}
          {viewMode === 'grid' ? (
            <BookCard book={book} />
          ) : (
            <div className="flex items-center gap-4 p-4 border rounded bg-[var(--surface-bg)]">
              <img
                src={book.coverPath}
                alt={book.title}
                className="w-16 h-24 object-cover rounded"
              />
              <div className="flex-1 min-w-0">
                <h4 className="font-semibold truncate">{book.title}</h4>
                <p className="text-sm text-[var(--text-tertiary)] truncate">
                  {book.author} - {book.publisher}, ed. {book.edition}
                </p>
              </div>
              <Button
                variant="icon"
                aria-label="Ver detalhes"
                icon={BookOpen}
                onClick={() => {}}
              />
            </div>
          )}

          {/* overlay escuro */}
          <div className="
            absolute inset-0 rounded
            bg-black bg-opacity-0 
            group-hover:bg-opacity-50
            transition-opacity duration-300
          " />
          {/* botão centralizado */}
          <Link
            href={username ? `/profile/${username}` : '/login'}
            className={clsx(
              'absolute inset-0 flex items-center justify-center',
              'opacity-0 group-hover:opacity-100 transition-opacity duration-300'
            )}
          >
            <Button variant="default" size="sm">
              + Adicionar à estante
            </Button>
          </Link>
        </div>
        ))}
  
        {displayed.length === 0 && (
          <p className="text-center text-[var(--text-secondary)]">
            Nenhum livro encontrado.          </p>
        )}
      </main>
    </section>
  );
}