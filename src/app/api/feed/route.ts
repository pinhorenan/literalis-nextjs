// api/feed/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@server/auth';
import { prisma } from '@server/prisma';

export async function GET(req: NextRequest) {
    const { searchParams } = new URL(req.url);
    const mode = searchParams.get('mode') || 'all';
    const limit = parseInt(searchParams.get('limit') || '20', 10);

    // monta filtro inicial
    let where: any = {};

    if (mode === 'friends') {
        // garante autenticação
        const session = await getServerSession(authOptions);
        if (!session) {
            return NextResponse.json({ posts: [] });
        }
        // filtra posts de amigos
        const follows = await prisma.follow.findMany({
            where: { followerUsername: session.user.username },
            select: { followedUsername: true }
        })
        const followedUsernames = follows.map(f => f.followedUsername);
        if (followedUsernames.length === 0) {
            return NextResponse.json({ posts: [] });
        }
        where.authorUsername = { in: followedUsernames };
    }

    // query principal
    const posts = await prisma.post.findMany({
        where,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
            author: { select: { username: true, name: true, avatarPath: true } },
            book: { select: { isbn: true, title: true, coverPath: true, publicationDate: true, edition: true, language: true, author: true, publisher: true } },
            comments: {
                include: { author: { select: { username: true, name: true, avatarPath: true } } },
                orderBy: { createdAt: 'asc' },
            },
            likes: true,
            _count: { select: { likes: true, comments: true } }
        }
    });

    return NextResponse.json({ 
        posts: posts.map(p => ({
            ...p,
            likeCount: p._count.likes,
            commentCount: p._count.comments,
        }))
    });
}
