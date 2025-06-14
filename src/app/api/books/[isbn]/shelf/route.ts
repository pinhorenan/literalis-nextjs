// File: src/app/api/books/[isbn]/shelf/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@server/auth';
import { prisma } from '@server/prisma';
import { z } from 'zod';

const ProgressSchema = z.object({
  progress: z.number().min(0).max(100),
});

export async function GET(
  req: NextRequest,
  { params }: { params: { isbn: string } }
) {
  const { isbn } = params;

  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const entry = await prisma.userBook.findUnique({
    where: { userUsername_bookIsbn: { bookIsbn: isbn, userUsername: session.user.username } },
    include: { book: true },
  });

  if (!entry) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }

  return NextResponse.json({
    book: entry.book,
    progress: entry.progress,
    addedAt: entry.addedAt.toISOString(),
  });
}

export async function POST(
  req: NextRequest,
  { params }: { params: { isbn: string } }
) {
  const { isbn } = params;

  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const entry = await prisma.userBook.upsert({
    where: {
      userUsername_bookIsbn: {
        userUsername: session.user.username,
        bookIsbn: isbn,
      },
    },
    create: {
      bookIsbn: isbn,
      userUsername: session.user.username,
      progress: 0,
    },
    update: {},
    include: { book: true },
  });

  return NextResponse.json({
    book: entry.book,
    progress: entry.progress,
    addedAt: entry.addedAt.toISOString(),
  });
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: { isbn: string } }
) {
  const { isbn } = params;

  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const body = await req.json();
  const parsed = ProgressSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: 'Invalid progress value', issues: parsed.error.format() },
      { status: 400 }
    );
  }

  const updated = await prisma.userBook.update({
    where: {
      userUsername_bookIsbn: {
        bookIsbn: isbn,
        userUsername: session.user.username,
      },
    },
    data: { progress: parsed.data.progress },
    include: { book: true },
  });

  return NextResponse.json({
    book: updated.book,
    progress: updated.progress,
    addedAt: updated.addedAt.toISOString(),
  });
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { isbn: string } }
) {
  const { isbn } = params;

  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  await prisma.userBook.delete({
    where: {
      userUsername_bookIsbn: {
        bookIsbn: isbn,
        userUsername: session.user.username,
      },
    },
  });

  return NextResponse.json({ success: true });
}
