import Image from 'next/image';
import type { Book } from '@prisma/client';

interface Props {
    book: Book;
}

export default function BookCard({ book }: Props) {
    return (
        <div className="flex flex-row gap-5 w-auto p-4 border rounded-md">
            <Image
                src={book.coverPath}
                alt={'Capa: ${book.title}'}
                width={160}
                height={240}
                className="object-cover rounded"
            />
            <div className="flex flex-col mt-2 gap-1">
                <h2 className="mt-2 text-lg font-semibold">{book.title}</h2>
                <p className="text-sm text-gray-600">por {book.author}</p>
                <p className="text-xs text-gray-500">{book.publisher}, edição {book.edition}</p>
                <p className="mt-1 text-sm">{book.pages} páginas &ndash; {book.language}</p>
                <p className="mt-1 text-sm">ISBN: {book.isbn}</p>
            </div>
        </div>
    );
}