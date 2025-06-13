// api/posts/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@server/auth';
import { prisma } from '@server/prisma';

export async function GET(req: NextRequest) {
    const { searchParams } = new URL(req.url);
    const limit = parseInt(searchParams.get('limit') || '20', 10);
    const posts = await prisma.post.findMany({
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
            author: { select: { username: true, name: true, avatarPath: true } },
            book:   { select: { isbn: true, title: true, coverPath: true } }
        }
    })
    return NextResponse.json(posts);
}

export async function POST(req: NextRequest) {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { bookIsbn, excerpt, progressPct } = await req.json();
    const post = await prisma.post.create({
        data: {
            authorUsername: session.user.username,
            bookIsbn,
            excerpt,
            progressPct
        }
    });
    return NextResponse.json(post, { status: 201 });
}