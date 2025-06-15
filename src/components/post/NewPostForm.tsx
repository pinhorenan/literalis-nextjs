// File: src/components/post/NewPostForm.tsx
'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@components/ui/Buttons';
import Image from 'next/image';

interface BookOption {
    isbn: string;
    title: string;
    pages: number;
    coverUrl: string;
}

export default function NewPostForm({ onClose }: { onClose: () => void}) {
    const router = useRouter();
    
    const [books, setBooks]                 = useState<BookOption[]>([]);
    const [selectedBook, setSelectedBook]   = useState<string>('');
    const [excerpt, setExcerpt]             = useState<string>('');
    const [currentPage, setCurrentPage]     = useState<number>(0);
    const [progress, setProgress]           = useState<number>(0);
    const [loading, setLoading]             = useState<boolean>(false);
    const [error, setError]                 = useState<string | null>(null);

    const selectedBookInfo = books.find((b) => b.isbn === selectedBook);

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
        if (!selectedBookInfo) return;
        if (currentPage < 0 || currentPage > selectedBookInfo.pages) {
            setError('Página inválida.');
            return;
        }

        setLoading(true);
        const res = await fetch('/api/posts', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                bookIsbn: selectedBook,
                excerpt,
                progress,
            }),
        });

        setLoading(false);
        if (!res.ok) {
            setError('Erro ao criar post.');
        } else {
            router.refresh();
            onClose?.();
        }
    };

    return (
        <div className="max-w-3xl mt-4">
            <form 
                onSubmit={handleSubmit} 
                className="grid grid-cols-1 md:grid-cols-2 gap-6 border border-[var(--border-base)] p-4 rounded-md bg-[var(--surface-bg)]"
            >
                {/* Seleção de livro */}
                <div>
                    <label className="block mb-1 font-medium">Livro</label>    
                    <select
                        className="w-full border rounded p-2"
                        value={selectedBook}
                        onChange={(e) => {
                            const isbn = e.target.value;
                            setSelectedBook(isbn);
                            const book = books.find(b => b.isbn === isbn);
                            if (book?.pages) {
                                setCurrentPage(1);
                                setProgress(Math.round((1 / book.pages) * 100));
                            }
                        }}  
                        required
                    >
                        <option value="" disabled>Selecione um livro...</option>
                        {books.map((book) => (
                            <option key={book.isbn} value={book.isbn} className="py-2 bg-[var(--surface-card)] hover:bg-[var(--surface-card-hover)] focus:outline-none ] ">
                                {book.title}
                            </option>
                        ))}
                    </select>

                    {/* Detalhes do livro selecionado */}
                    {selectedBookInfo && (
                        <div className="flex gap-4 mt-4 items-start">
                            <Image
                                src={selectedBookInfo.coverUrl}
                                alt={selectedBookInfo.title}
                                width={96}
                                height={144}
                                className="w-24 rounded border"
                            />
                            <div>
                                <strong className="block">{selectedBookInfo.title}</strong>
                                <span className="text-sm text-[var(--text-secondary)]">{selectedBookInfo.pages} páginas</span>
                            </div>
                        </div>
                    )}

                    
                        {selectedBookInfo && (
                            <div className="flex items-center gap-4 mt-4">
                                <label className="block mt-4">
                                    <span className="block mb-1">Página atual</span>
                                    <input 
                                        type="number"
                                        max={selectedBookInfo.pages}
                                        value={currentPage}
                                        onChange={(e) => {
                                            const val = parseInt(e.target.value, 10);
                                            if (!isNaN(val)) {
                                                const bounded = Math.max(1, Math.min(val, selectedBookInfo.pages));
                                                setCurrentPage(bounded);
                                                setProgress(Math.round((bounded / selectedBookInfo.pages) * 100));
                                            }
                                        }} 
                                        className="w-full border rounded p-2"
                                    />
                                    <small className="text-xs text-[var(--text-tertiary)]">Progresso: {progress}%</small>
                                </label>

                                <div className="block mt-4">
                                    {error && <p className="text-red-500 text-sm mb-2">{error}</p>}
                                    <Button type="submit" disabled={loading}>
                                        {loading ? 'Publicando...' : 'Publicar'}
                                    </Button>
                                </div>
                            </div>
                        )}
                    
                </div>

                {/* Texto do post */}
                <div className="flex flex-col">
                    <label className="block mb-1 font-medium">Trecho ou comentário</label>
                    <textarea
                        className="w-full border rounded p-2 flex-1"
                        value={excerpt}
                        onChange={(e) => setExcerpt(e.target.value)}
                        placeholder="Escreva algo sobre o livro..."
                        rows={5}
                    />
                </div>

                
            </form>
        </div>
    );
}