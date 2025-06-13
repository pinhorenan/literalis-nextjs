// api/books/[isbn]/shelf/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@server/auth';
import { prisma } from '@server/prisma';

export async function GET(req: NextRequest, context: { params: { isbn: string } }) {
    const { isbn } = context.params;

    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const entry = await prisma.userBook.findUnique({
        where: { bookIsbn_username: { bookIsbn: isbn, username: session.user.username } },
        include: { book: true }
    });
    return NextResponse.json(entry);
}

export async function POST(req: NextRequest, context: { params: { isbn: string } }) {
    const { isbn } = context.params;

    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const entry = await prisma.userBook.create({
        data: { bookIsbn: isbn, username: session.user.username }
    });
    return NextResponse.json(entry);
}

export async function PATCH(req: NextRequest, context: { params: { isbn: string } }) {
    const { isbn } = context.params;

    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { progress } = await req.json();
    const updated = await prisma.userBook.update({
        where: { bookIsbn_username: { bookIsbn: isbn, username: session.user.username } },
        data: { progress }
    })
    return NextResponse.json(updated);
}

export async function DELETE(req: NextRequest, context: { params: { isbn: string } }) {
    const { isbn } = context.params;

    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    await prisma.userBook.delete({
        where: { bookIsbn_username: { bookIsbn: isbn, username: session.user.username } }
    });
    return NextResponse.json({ success: true });
}