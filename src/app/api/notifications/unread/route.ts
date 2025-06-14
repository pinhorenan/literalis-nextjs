// File: src/app/api/notifications/unread/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@server/auth';
import { prisma } from '@server/prisma';

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session)
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const unread = await prisma.notification.findMany({
    where: {
      recipientId: session.user.username,
      readAt: null,
    },
    orderBy: { createdAt: 'desc' },
    include: {
      actor: {
        select: {
          username: true,
          name: true,
          avatarUrl: true,
        },
      },
      post: {
        select: {
          id: true,
          excerpt: true,
        },
      },
    },
  });

  return NextResponse.json(unread);
}
