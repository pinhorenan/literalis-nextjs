// File: src/app/api/users/[username]/shelf/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@server/auth';
import { prisma } from '@server/prisma';
import { z } from 'zod';

const AddToShelfSchema = z.object({
    isbn:       z.string().min(10),
    progress:   z.number().min(0).max(100).optional(),
});

export async function GET(
    req: NextRequest, 
    { params }: { params: Promise<{ username: string }> }
) {
    const { username } = await params;
    const shelf = await prisma.userBook.findMany({
        where: { username }, 
        include: { book: true },
    });
    const data = shelf.map(item => ({
        book: { ...item.book, coverPath: item.book.coverPath },
        progress: item.progress,
        addedAt: item.addedAt.toISOString(),
    }));
    return NextResponse.json(data);
}

export async function POST(
    req: NextRequest,
    { params }: { params: { username: string } }
) {
    const session = await getServerSession(authOptions);
    if (!session?.user?.username || session.user.username !== params.username) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    const body = await req.json();
    const parsed = AddToShelfSchema.safeParse(body);
    if (!parsed.success) {
        return NextResponse.json(
            { error: 'Dados inválidos', issues: parsed.error.format() },
            { status: 400 }
        );
    }
    
    const { isbn, progress = 0} = parsed.data;
    const record = await prisma.userBook.upsert({
        where: { bookIsbn_username: { bookIsbn: isbn, username: params.username } },
        create: { bookIsbn: isbn, username: params.username, progress },
        update: { progress },
        include: { book: true },
    });

    return NextResponse.json({
        book: { ...record.book, coverPath: record.book.coverPath },
        progress: record.progress,
        addedAt: record.addedAt.toISOString(),
    });
}