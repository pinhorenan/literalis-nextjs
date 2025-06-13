// api/users/[username]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@server/auth';
import { prisma } from '@server/prisma';

export async function GET(req: NextRequest, context: { params: { username: string } }) {
    const { username } = context.params;

    const user = await prisma.user.findUnique({
        where: { username: username },
        select: { username: true, name: true, bio: true, avatarPath: true, email: true }
    });
    if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 });
    return NextResponse.json(user);
}

export async function PATCH(req: NextRequest, context: { params: { username: string } }) {
    const { username } = context.params;
    
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    if (session.user.username !== username) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    
    const body = await req.json();
    const { name, bio, avatarPath } = body;
    const updated = await prisma.user.update({
        where: { username: username },
        data: { name, bio, avatarPath }
    });
    return NextResponse.json(updated);
}

export async function DELETE(req: NextRequest, context: { params: { username: string } }) {
    const { username } = context.params;

    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    if (session.user.username !== username) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

    await prisma.user.delete({
        where: { username: username }
    });
    return NextResponse.json({ success: true }, { status: 204 });
}