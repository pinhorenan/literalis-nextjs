// File: src/app/api/posts/[postId]/likes/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@server/auth';
import { prisma } from '@server/prisma';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ postId: string }> }
) {
  const { postId } = await params;

  const session = await getServerSession(authOptions);
  if (!session?.user?.username) {
    return NextResponse.json({ liked: false }, { status: 401 });
  }

  const exists = await prisma.like.findUnique({
    where: {
      userUsername_postId: {
        userUsername: session.user.username,
        postId: postId,
      },
    },
  });

  return NextResponse.json({ liked: Boolean(exists) });
}

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ postId: string }> }
) {
  const { postId } = await params;

  const session = await getServerSession(authOptions);
  if (!session?.user?.username) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const like = await prisma.like.create({
    data: {
      userUsername: session.user.username,
      postId: postId,
    },
  });

  return NextResponse.json(like);
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ postId: string }> }
) {
  const { postId } = await params;

  const session = await getServerSession(authOptions);
  if (!session?.user?.username) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  await prisma.like.delete({
    where: {
      userUsername_postId: {
        userUsername: session.user.username,
        postId: postId,
      },
    },
  });

  return NextResponse.json({ success: true });
}
