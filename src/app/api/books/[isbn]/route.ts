// File: src/app/api/books/[isbn]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@server/auth';
import { prisma } from '@server/prisma';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ isbn: string }> }
) {
  const { isbn } = await params;

  const book = await prisma.book.findUnique({
    where: { isbn },
    include: {
      posts: {
        include: {
          author: {
            select: { username: true, name: true, avatarUrl: true },
          },
          _count: {
            select: { comments: true, likes: true },
          },
        },
        orderBy: { createdAt: 'desc' },
      },
    },
  });

  if (!book) {
    return NextResponse.json({ error: 'Book not found' }, { status: 404 });
  }

  return NextResponse.json(book);
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ isbn: string }> }
) {
  const { isbn } = await params;
  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
  }

  const data = await req.json();

  // converte string para Date se necessário
  if (typeof data.publicationDate === 'string') {
    data.publicationDate = new Date(data.publicationDate);
  }

  const updated = await prisma.book.update({
    where: { isbn },
    data,
  });

  return NextResponse.json(updated);
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ isbn: string }> }
) {
  const { isbn } = await params;
  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
  }

  await prisma.book.delete({ where: { isbn } });

  return NextResponse.json({ success: true });
}
