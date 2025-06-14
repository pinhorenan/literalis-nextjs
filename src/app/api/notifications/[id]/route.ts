// File: src/app/api/notifications/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@server/auth';
import { prisma } from '@server/prisma';

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const notif = await prisma.notification.findUnique({
    where: { id },
  });

  if (!notif || notif.recipientId !== session.user.username) {
    return NextResponse.json({ error: 'Not found or forbidden' }, { status: 404 });
  }

  const updated = await prisma.notification.update({
    where: { id },
    data: { readAt: new Date() },
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

  const notif = await prisma.notification.findUnique({
    where: { id },
  });

  if (!notif || notif.recipientId !== session.user.username) {
    return NextResponse.json({ error: 'Not found or forbidden' }, { status: 404 });
  }

  await prisma.notification.delete({ where: { id } });

  return NextResponse.json({ success: true });
}
