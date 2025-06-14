// File: src/app/api/posts/[postId]/comments/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@server/auth';
import { prisma } from '@server/prisma';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ postId: string }> }
) {
  const { postId } = await params;

  const comments = await prisma.comment.findMany({
    where: { postId },
    include: {
      author: {
        select: {
          username: true,
          name: true,
          avatarUrl: true, // ✅ campo correto
        },
      },
    },
    orderBy: { createdAt: 'asc' },
  });

  return NextResponse.json(comments);
}

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ postId: string }> }
) {
  const { postId } = await params;

  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { content } = await req.json(); // ✅ nome correto

  const comment = await prisma.comment.create({
    data: {
      authorUsername: session.user.username, // ✅ campo correto
      postId,
      content,
    },
    include: {
      author: {
        select: {
          username: true,
          name: true,
          avatarUrl: true,
        },
      },
    },
  });

  return NextResponse.json(comment);
}
