// File: src/app/api/notifications/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@server/auth';
import { prisma } from '@server/prisma';

/**
 * Lista as notificações do usuário autenticado
 */
export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session)
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const notifications = await prisma.notification.findMany({
    where: { recipientId: session.user.username },
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

  return NextResponse.json(notifications);
}

/**
 * Marca como lida uma notificação específica (via id no body)
 * ou todas se nenhum id for passado
 */
export async function PATCH(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session)
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { id } = await req.json().catch(() => ({}));

  const result = await prisma.notification.updateMany({
    where: {
      recipientId: session.user.username,
      ...(id && { id }),
      readAt: null,
    },
    data: {
      readAt: new Date(),
    },
  });

  return NextResponse.json({ updated: result.count });
}

/**
 * Apaga uma notificação (se passar id no body)
 * ou todas as notificações do usuário atual
 */
export async function DELETE(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session)
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { id } = await req.json().catch(() => ({}));

  const result = await prisma.notification.deleteMany({
    where: {
      recipientId: session.user.username,
      ...(id && { id }),
    },
  });

  return NextResponse.json({ deleted: result.count });
}
