// File: src/app/api/me/bookshelf/route.ts

import { getServerSession } from 'next-auth';
import { authOptions } from '@server/auth';
import { prisma } from '@server/prisma';
import { NextResponse } from 'next/server';

export async function GET() {
    const session = await getServerSession(authOptions);
    if(!session?.user?.username) return NextResponse.json({ books: [] });

    const bookshelf = await prisma.userBook.findMany({
        where: { userUsername: session.user.username },
        select: {
            book: {
                select: {
                    isbn: true,
                    title: true,
                    coverUrl: true,
                },
            },
        },
    });

    return NextResponse.json({
        books: bookshelf.map((entry) => entry.book),
    });
}