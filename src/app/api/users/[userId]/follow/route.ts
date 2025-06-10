// api/users/[userId]/follow/route.ts
import { NextResponse }     from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions }      from '@server/auth';
import { prisma }           from '@server/prisma';

export async function POST(_: Request, { params }: { params: { userId: string } }) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { userId } = params;
  if (userId === session.user.id)
    return NextResponse.json({ error: 'Não pode seguir a si mesmo' }, { status: 400 });

  await prisma.follow.upsert({
    where: { followerId_followedId: { followerId: session.user.id, followedId: userId } },
    create: { followerId: session.user.id, followedId: userId },
    update: {},
  });

  return NextResponse.json({ follows: true });
}

export async function DELETE(_: Request, { params }: { params: { userId: string } }) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { userId } = params;

  await prisma.follow.deleteMany({
    where: { followerId: session.user.id, followedId: userId },
  });

  return NextResponse.json({ follows: false });
}
