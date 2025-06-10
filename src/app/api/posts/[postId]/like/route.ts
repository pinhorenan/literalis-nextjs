// api/posts/[postId]/like/route.ts
import { NextResponse }     from 'next/server';
import { getServerSession } from 'next-auth';
import { ReactionType }     from '@prisma/client';
import { authOptions }      from '@server/auth';
import { prisma }           from '@server/prisma';

export async function POST(request: Request, context: { params: any }) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { postId } = await context.params;

  await prisma.$transaction([
    prisma.reaction.upsert({
      where: {
        userId_postId_type: {
          userId: session.user.id,
          postId,
          type: ReactionType.LIKE,
        },
      },
      create: {
        userId: session.user.id,
        postId,
        type: ReactionType.LIKE,
      },
      update: {}, // nada
    }),
    prisma.post.update({
      where: { id: postId },
      data:  { reactionsCount: { increment: 1 } },
    }),
  ]);

  return NextResponse.json({ liked: true });
}

export async function DELETE(_: Request, { params }: { params: { postId: string } }) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { postId } = params;

  await prisma.$transaction([
    prisma.reaction.deleteMany({
      where: {
        userId: session.user.id,
        postId,
        type: ReactionType.LIKE,
      },
    }),
    prisma.post.update({
      where: { id: postId },
      data:  { reactionsCount: { decrement: 1 } },
    }),
  ]);

  return NextResponse.json({ liked: false });
}
