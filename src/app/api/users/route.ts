// api/users/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@server/prisma';

export async function GET(req: NextRequest) {
    const users = await prisma.user.findMany({
        select: { username: true, name: true, bio: true, avatarUrl: true }
    })
    return NextResponse.json(users);
}