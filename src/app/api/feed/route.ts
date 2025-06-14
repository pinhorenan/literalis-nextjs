// File: src/app/api/feed/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@server/auth';
import { prisma } from '@server/prisma';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const mode = searchParams.get('mode') || 'all';
  const limit = parseInt(searchParams.get('limit') || '20', 10);

  let where: any = {};

  if (mode === 'friends') {
    const session = await getServerSession(authOptions);
    if (!session?.user?.username) {
      return NextResponse.json({ posts: [] });
    }

    const follows = await prisma.follow.findMany({
      where: { followerId: session.user.username },
      select: { followedId: true },
    });

    const followedUsernames = follows.map(f => f.followedId);
    if (followedUsernames.length === 0) {
      return NextResponse.json({ posts: [] });
    }

    where.authorUsername = { in: followedUsernames };
  }

  const posts = await prisma.post.findMany({
    where,
    take: limit,
    orderBy: { createdAt: 'desc' },
    include: {
      author: {
        select: {
          username: true,
          name: true,
          avatarUrl: true, // ✅ campo correto no schema
        },
      },
      book: {
        select: {
          isbn: true,
          title: true,
          coverUrl: true,
          publicationDate: true,
          edition: true,
          language: true,
          author: true,
          publisher: true,
        },
      },
      comments: {
        include: {
          author: {
            select: {
              username: true,
              name: true,
              avatarUrl: true,
            },
          },
        },
        orderBy: { createdAt: 'asc' },
      },
      likes: {
        select: { userUsername: true },
      },
      _count: {
        select: {
          likes: true,
          comments: true,
        },
      },
    },
  });

  return NextResponse.json({
    posts: posts.map(p => ({
      ...p,
      likeCount: p._count.likes,
      commentCount: p._count.comments,
    })),
  });
}
