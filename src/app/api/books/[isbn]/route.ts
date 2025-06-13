// api/books/[isbn]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@server/auth';
import { prisma } from '@server/prisma';

export async function GET(req: NextRequest, context: { params: { isbn: string } }) {
    const { isbn } = context.params;

    const book = await prisma.book.findUnique({
        where: { isbn: isbn },
        include: { posts: true }
    });
    if (!book) return NextResponse.json({ error: 'Book not found' }, { status: 404 });
    return NextResponse.json(book);
}

export async function PATCH(req: NextRequest, context: { params: { isbn: string } }) {
    const { isbn } = context.params;

    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    
    const data = await req.json();
    const updated = await prisma.book.update({
        where: { isbn: isbn },
        data
    });
    return NextResponse.json(updated);
}

export async function DELETE(req: NextRequest, context: { params: { isbn: string } }) {
    const { isbn } = context.params;

    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    await prisma.book.delete({ where: { isbn: isbn } });
    return NextResponse.json({ success: true });
}