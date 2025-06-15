// File: src/app/api/search/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@server/prisma';

export async function GET(req: NextRequest) {
    const { searchParams } = new URL(req.url);
    const q = searchParams.get('q') ?? '';
    const type = searchParams.get('type');

    if (!q || !type) return NextResponse.json([]);

    if (type === 'books') {
        const books = await prisma.book.findMany({
            where: {
                OR: [
                    { title: { contains: q } },
                    { author: { contains: q } },
                ],
            },
            take: 20,
        });
        return NextResponse.json(books);
    }

    if (type === 'users') {
        const users = await prisma.user.findMany({
            where: {
                OR: [
                    { name: { contains: q } },
                    { username: { contains: q } },
                ],
            },
            take: 20,
        });
        return NextResponse.json(users);
    }

    return NextResponse.json([]);
}
