// app/api/books/route.ts
import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/src/lib/prisma';

/**
 * GET /api/books?isbn=1234567890
 * Se houver query 'isbn', devolve só o livro com aquele ISBN.
 * Senão, devolve todos os livros.
 */
export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const isbn = searchParams.get('isbn');

        let books;
        if (isbn) {
            // Busca um único livro por ISBN
            const book = await prisma.book.findUnique({
                where: { isbn },
            });
            if (!book) {
                return NextResponse.json(
                    { error: `Livro com ISBN "${isbn}" não encontrado.` },
                    { status: 404 }
                );
            }
            books = book;
        } else {
            // Busca todos os livros
            books = await prisma.book.findMany({
                orderBy: { title: 'asc' },
            });
        }

        return NextResponse.json(books, { status: 200 });
    }   catch (error: any) {
        console.error('GET /api/books error:', error);
        return NextResponse.json(
            { error: 'Erro ao buscar livros.' },
            { status: 500 }
        );
    }
}

/**
 * POST /api/books
 * Body JSON esperado:
 * {
 * "isbn": "1234567890",
 * "title": "Título do Livro",
 * "author": "Autor do Livro",
 * "publisher": "Editora do Livro",
 * "edition": 1,
 * "pages": 300,
 * "language": "Português",
 * "publicationDate": "2023-01-01",
 * "coverPath": "/path/to/cover.jpg",
 * }
 */
export async function POST(request: NextRequest) {
    try {
        const data = await request.json();

        // Validações básicas
        if (
            typeof data.isbn            !== 'string' ||
            typeof data.title           !== 'string' ||
            typeof data.author          !== 'string' ||
            typeof data.publisher       !== 'string' ||
            typeof data.edition         !== 'number' ||
            typeof data.pages           !== 'number' ||
            typeof data.language        !== 'string' ||
            typeof data.publicationDate !== 'string' ||
            typeof data.coverPath       !== 'string'
        ) {
            return NextResponse.json(
                { error: 'Todos os campos são obrigatórios.' },
                { status: 400 }
            );
        }

        // Converte a data de publicação para Date
        const publicationDate = new Date(data.publicationDate);
        if (isNaN(publicationDate.getTime())) {
            return NextResponse.json(
                { error: 'publicationDate inválido (deve ser ISO-8601).' },
                { status: 400 }
            );
        }

        // Cria o livro no banco
        const newBook = await prisma.book.create({
            data: {
                isbn:               data.isbn,
                title:              data.title,
                author:             data.author,
                publisher:          data.publisher,
                edition:            data.edition,
                pages:              data.pages,
                language:           data.language,
                publicationDate:    publicationDate,
                coverPath:          data.coverPath,
            },
        });

        return NextResponse.json(newBook, { status: 201 });
    }   catch (error: any) {
        console.error('POST /api/books error:', error);
        // Caso ultra violação de unique (por ex., ISBN duplicado)
        if (error.code === 'P2002') {
            return NextResponse.json(
                { error: 'ISBN já cadastrado.' },
                { status: 409 }
            );
        }
        return NextResponse.json(
            { error: 'Erro ao criar livro.' },
            { status: 500 }
        );
    }
}