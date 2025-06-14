// File: src/app/api/feed/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@server/auth';
import { prisma } from '@server/prisma';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const mode = searchParams.get('mode') || 'all';
  const limit = parseInt(searchParams.get('limit') || '20', 10);

  if (!['friends', 'discover'].includes(mode ?? '')) {
    return NextResponse.json(
      { error: 'Modo inválido. Use friends ou discover.'},
      { status: 400 }
    );
  }

  const session = await getServerSession(authOptions);
  const meUsername = session?.user?.username;

  if (!meUsername) {
    return NextResponse.json(
      { error: 'Usuário não autenticado.' },
      { status: 401 }
    );
  }

  const follows = await prisma.follow.findMany({
    where: { followerId: meUsername },
    select: { followedId: true },
  });

  const followedUsernames = follows.map(f => f.followedId);

  const where: any = {};

  if (mode === 'friends') {
    if (followedUsernames.length === 0) {
      return NextResponse.json({ posts: [] });
    }
    where.authorUsername = { in: followedUsernames };
  }

  if (mode === 'discover') {
    where.authorUsername = { notIn: [...followedUsernames, meUsername] };
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
          avatarUrl: true,
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
          pages: true,
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
      likes: false,
      _count: {
        select: {
          likes: true,
          comments: true,
        },
      },
    },
  });

  const postIds = posts.map(p => p.id);

  const myLikes = await prisma.like.findMany({
    where: {
      userUsername: meUsername,
      postId: { in: postIds },
    },
    select: { postId: true },
  })

  const likedPostIds = new Set(myLikes.map(l => l.postId));

  return NextResponse.json({
    posts: posts.map(post => ({
      ...post,
      likeCount: post._count.likes,
      commentCount: post._count.comments,
      likedByMe: likedPostIds.has(post.id),
      isFollowingAuthor: followedUsernames.includes(post.author.username),
      createdAt: post.createdAt.toISOString(),
    })),
  });
}
