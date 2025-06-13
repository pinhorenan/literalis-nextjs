// api/users/[username]/shelf/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@server/prisma';

export async function GET(req: NextRequest, context: { params: { username: string } }) {
    const { username } = context.params;

    const shelf = await prisma.userBook.findMany({
        where: { username: username },
        include: { book: true }
    });
    return NextResponse.json(shelf);
}