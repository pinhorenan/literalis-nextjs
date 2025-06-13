// api/notifications/unread/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@server/auth';
import { prisma } from '@server/prisma';

export async function GET(req: NextRequest) {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    
    const notifications = await prisma.notification.findMany({
        where: { userUsername: session.user.username, readAt: null },
        orderBy: { createdAt: 'desc' },
    });
    return NextResponse.json(notifications);
}