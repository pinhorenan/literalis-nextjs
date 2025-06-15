// File: src/app/api/me/bookshelf/route.ts
import { NextResponse }     from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions }      from '@server/auth';
import { prisma }           from '@server/prisma';

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
                    pages: true,
                    coverUrl: true,
                },
            },
        },
    });

    return NextResponse.json({
        books: bookshelf.map((entry) => entry.book),
    });
}