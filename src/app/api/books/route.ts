// File: src/app/api/books/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@server/auth';
import { prisma } from '@server/prisma';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const limit = parseInt(searchParams.get('limit') || '20', 10);

  const books = await prisma.book.findMany({
    take: limit,
    orderBy: { title: 'desc' },
  });

  return NextResponse.json(books);
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const {
    isbn,
    title,
    author,
    publisher,
    edition,
    pages,
    language,
    publicationDate,
    coverUrl, // corrigido: coverPath → coverUrl
  } = await req.json();

  const book = await prisma.book.create({
    data: {
      isbn,
      title,
      author,
      publisher,
      edition,
      pages,
      language,
      publicationDate: new Date(publicationDate),
      coverUrl: coverUrl || '/assets/images/books/default.jpg', // fallback
    },
  });

  return NextResponse.json(book);
}
