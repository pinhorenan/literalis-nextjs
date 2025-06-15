// File: src/components/search/SearchResults.tsx
'use client';

import type { Book, User } from '@prisma/client';
import BookCard from '@components/book/BookCard';
import Link     from 'next/link';
import Image    from 'next/image';
import useSWR   from 'swr';

interface Props {
    query: string;
    tab: 'books' | 'users';
}

const fetcher = (url: string) => fetch(url).then(r => r.json());

export default function SearchResults({ query, tab }: Props) {
    const { data, error, isLoading } = useSWR(
        query ? `/api/search?tab=${tab}&q=${encodeURIComponent(query)}` : null,
        fetcher
    );

    if (!query) return null
    if (isLoading) return <p>Carregando...</p>; // TODO: construir um skeleton
    if (error) return <p>Erro ao buscar.</p>;
    if (!data || data.length === 0) return <p>Nenhum resultado encontrado.</p>;

    return (
        <div className="space-y-4 mt-4">
            {tab === 'books' &&
                data.map((book: Book) => (
                    <BookCard key={book.isbn} book={book} />
                ))}

            {tab === 'users' &&
                data.map((user: User) => (
                    <Link
                        key={user.username}
                        href={`/profile/${user.username}`}
                        className="flex items-center gap-3"
                    >
                        <Image src={user.avatarUrl} alt={user.name} width={40} height={40} className="rounded-full" />
                        <span>{user.name}</span>
                    </Link>
                ))}
        </div>
    );
}