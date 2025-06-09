// api/users/[userId]/follows/me/route.ts
import { NextResponse }     from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions }      from '@server/auth';
import { prisma }           from '@server/prisma';

export async function GET(_: Request, { params }: { params: { userId: string } }) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ follows: false });

  const { userId } = params;

  const existing = await prisma.follow.findUnique({
    where: {
      followerId_followedId: {
        followerId: session.user.id,
        followedId: userId,
      },
    },
  });

  return NextResponse.json({ follows: Boolean(existing) });
}
