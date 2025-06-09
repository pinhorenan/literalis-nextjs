// api/posts/[postId]/like/likes/me/route.ts
import { NextResponse }     from 'next/server';
import { getServerSession } from 'next-auth';
import { ReactionType }     from '@prisma/client';
import { authOptions }      from '@server/auth';
import { prisma }           from '@server/prisma';

export async function GET(_: Request, { params }: { params: { postId: string } }) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ liked: false });

  const { postId } = params;

  const existing = await prisma.reaction.findUnique({
    where: {
      userId_postId_type: {
        userId: session.user.id,
        postId,
        type: ReactionType.LIKE,
      },
    },
  });

  return NextResponse.json({ liked: Boolean(existing) });
}
