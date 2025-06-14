// File: src/components/post/NewPostForm.tsx
'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@components/ui/Buttons';

interface BookOption {
    isbn: string;
    title: string;
    coverUrl: string;
}

export default function NewPostForm() {
    const router = useRouter();
    
    const [books, setBooks]                 = useState<BookOption[]>([]);
    const [selectedBook, setSelectedBook]   = useState<string>('');
    const [excerpt, setExcerpt]             = useState<string>('');
    const [progress, setProgress]           = useState<number>(0);
    const [loading, setLoading]             = useState<boolean>(false);
    const [error, setError]                 = useState<string | null>(null);

    // carrega livros da estante
    useEffect(() => {
        const load = async () => {
            const res = await fetch('/api/me/bookshelf/');
            if (!res.ok) { return setError('Erro ao carregar livros.')};
            const json = await res.json();
            setBooks(json.books ?? []);
        };
        load();
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setLoading(true);

        const res = await fetch('/api/posts', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                bookIsbn: selectedBook,
                excerpt: excerpt,
                progress: progress,
            }),
        });

        setLoading(false);

        if(!res.ok) {
            setError('Erro ao criar post.');
            return;
        }

        // atualiza o feed
        router.refresh();
    };

    return (
        <div className="max-w-3xl mt-4">
            <h2 className="text-lg font-semibold">Novo Post</h2>
            <form onSubmit={handleSubmit} className="flex gap-4 border border-red-500 space-y-4 max-w-x1 mx-auto">

                {error && <p className="text-red-500 text-sm">{error}</p>}

                <div>
                    <label className="block">
                        <span>Livro</span>
                        <select
                            className="w-full border rounded p-2"
                            value={selectedBook}
                            onChange={(e) => setSelectedBook(e.target.value)}
                            required
                        >
                            <option value="" disabled>Selecione um livro...</option>
                            {books.map((book) => (
                                <option key={book.isbn} value={book.isbn}>
                                    {book.title}
                                </option>
                            ))}
                        </select>
                    </label>

                    <label className="block">
                        <span>Progresso de leitura (%)</span>
                        <input 
                            type="number"
                            min={0}
                            max={100}
                            className="w-full border rounded p-2"
                            value={progress}
                            onChange={(e) => setProgress(parseInt(e.target.value, 10))}
                            required
                        />
                    </label>
                </div>

                <div className="flex-1">
                    <label className="block h-full">
                        <span>Trecho / comentário FODASE</span>
                        <textarea
                            className="w-full border rounded p-2"
                            value={excerpt}
                            onChange={(e) => setExcerpt(e.target.value)}
                            rows={3}
                            placeholder="Escreva algo sobre o livro..."
                        />
                    </label>
                </div>


                <Button type="submit" disabled={loading}>
                    {loading ? 'Publicando...' : 'Publicar'}
                </Button>
            </form>

        </div>
    );
}