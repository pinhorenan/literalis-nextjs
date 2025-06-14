// File: src/app/api/posts/[post]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@server/auth';
import { prisma } from '@server/prisma';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  const [post, likeCount] = await Promise.all([
    prisma.post.findUnique({
      where: { id },
      include: {
        author: true,
        book: true,
        comments: {
          orderBy: { createdAt: 'asc' },
        },
        likes: {
          select: { userUsername: true },
        },
      },
    }),
    prisma.like.count({ where: { postId: id } }),
  ]);

  if (!post) {
    return NextResponse.json({ error: 'Post not found' }, { status: 404 });
  }

  return NextResponse.json({
    ...post,
    likeCount,
  });
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const existing = await prisma.post.findUnique({
    where: { id },
  });

  if (!existing || existing.authorUsername !== session.user.username) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  const { excerpt, progress } = await req.json();

  const updated = await prisma.post.update({
    where: { id },
    data: { excerpt, progress },
  });

  return NextResponse.json(updated);
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const existing = await prisma.post.findUnique({
    where: { id },
  });

  if (!existing || existing.authorUsername !== session.user.username) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  await prisma.post.delete({
    where: { id },
  });

  return NextResponse.json({ success: true });
}
