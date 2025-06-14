// File: src/app/api/posts/route.ts

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
      author: {
        select: {
          username: true,
          name: true,
          avatarUrl: true,
        },
      },
      book: {
        select: {
          isbn: true,
          title: true,
          coverUrl: true,
        },
      },
    },
  });

  return NextResponse.json(posts);
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.username) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { bookIsbn, excerpt, progress } = await req.json();

  const post = await prisma.post.create({
    data: {
      authorUsername: session.user.username,
      bookIsbn,
      excerpt,
      progress,
    },
  });

  return NextResponse.json(post, { status: 201 });
}
