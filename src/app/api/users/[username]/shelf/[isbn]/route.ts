// File: src/app/api/users/[username]/shelf/[isbn]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@server/auth';
import { prisma } from '@server/prisma';
import { z } from 'zod';

const UpdateSchema = z.object({
    progress: z.number().min(0).max(100),
});

export async function PATCH(
    req: NextRequest, 
    { params }: { params: Promise<{ username: string, isbn: string}> }
) {
    const { username, isbn } = await params;

    const session = await getServerSession(authOptions);
    if (!session?.user?.username || session.user.username !== username) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    const body = await req.json();
    const parsed = UpdateSchema.safeParse(body);
    if (!parsed.success) {
        return NextResponse.json(
            { error: 'Dados inválidos', issues: parsed.error.format() },
            { status: 400 }
        );
    }

    const updated = await prisma.userBook.update({
        where: { bookIsbn_username: { bookIsbn: isbn, username: username } },
        data: { progress: parsed.data.progress },
        include: { book: true },
    });

    return NextResponse.json({
        book: { ...updated.book, coverPath: updated.book.coverPath },
        progress: updated.progress,
        addedAt: updated.addedAt.toISOString(),
    });
}

export async function DELETE(
    req: NextRequest,
    { params }: { params: Promise<{ username: string, isbn: string }> }
) {
    const { username, isbn } = await params;
    
    const session = await getServerSession(authOptions);
    if (!session?.user?.username || session.user.username !== username) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    await prisma.userBook.delete({
        where: { bookIsbn_username: { bookIsbn: isbn, username: username } }
    });

    return NextResponse.json({ ok: true });
}