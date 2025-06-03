'use client';
import React, { useEffect, useState } from 'react';
import Link from 'next/link';

import type { Book } from '@prisma/client';

export default function RecommendedSidebar() {
    const [recommendedBooks, setRecommendedBooks] = useState<Book[]>([]);
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        async function fetchBooks() {
            try {
                const resp = await fetch('/api/books');
                if (!resp.ok) throw new Error('Falha ao buscar livros');
                const data: Book[] = await resp.json();
                setRecommendedBooks(data);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        }
        fetchBooks();
    }, []);

    if (loading) {
        return (
            <aside
                id="recommended-sidebar"
                className="
                    fixed top-[var(--header-h)] right-0 z-[50]
                    w-auto h-screen p-[var(--gap-md)]
                    flex flex-col items-start
                    overflow-y-auto
                "
                aria-label="Livros recomendados"
            >
                <h2 className="text-x2 font-semibold mb-4 text-[var(--olive)]">
                    Recomendados para você
                </h2>
                <p className="text-sm text-[var(--olive)]">Carregando...</p>
            </aside>
        );
    }

    return (
        <aside
            id="recommended-sidebar"
            className="
                fixed top-[var(--header-h)] right-0 z-[50]
                w-auto h-screen p-[var(--gap-md)]
                flex flex-col items-start
                overflow-y-auto
            "
            aria-label="Livros recomendados"
        >
            <h2 className="text-x2 font-semibold mb-4 text-[var(--olive)]">
                Recomendados para você
            </h2>

            <nav className="flex flex-col gap-0 w-full h-full" aria-label="Lista de recomendados">
                {recommendedBooks.map((book) => (
                    <Link
                        key={book.isbn}
                        href="/shelf"
                        passHref
                        className="
                            flex items-center gap-3
                            p-2 rounded
                            border-b border-[var(--olivy)]
                            hover:bg-[var(--olive)]
                            hover:text-[var(--offwhite)]
                            transition-colors duration-200
                        "
                    >
                        <img 
                            src={book.coverPath} 
                            alt={'Capa: ${book.title}'} 
                            className="w-30 h-auto object-cover rounded"
                        />
                        <div className="flex flex-col">
                            <span className="font-medium">{book.title}</span>
                            <span className="text-sm hover:text-white">{book.author}</span>
                        </div>
                    </Link>
                ))}
            </nav>
        </aside>
    );
}