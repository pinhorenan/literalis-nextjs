// api/users/[username]/shelf/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@server/prisma';

export async function GET(
    req: NextRequest, 
    { params }: { params: Promise<{ username: string }> }
) {
    const { username } = await params;

    const shelf = await prisma.userBook.findMany({
        where: { username: username }, include: { book: true }
    });

    return NextResponse.json(shelf);
}