// api/users/[username]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@server/auth';
import { prisma } from '@server/prisma';

export async function GET(
    req: NextRequest, 
    { params }: { params: Promise<{ username: string }> }
) {
    const { username } = await params;

    const user = await prisma.user.findUnique({ where: { username: username }, select: { username: true, name: true, bio: true, avatarUrl: true, email: true } });
    if (!user){
        return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    return NextResponse.json(user);
}

export async function PATCH(
    req: NextRequest, 
    { params }: { params: Promise<{ username: string }> }
) {
    const { username } = await params;
    
    const session = await getServerSession(authOptions);
    if (!session) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    } 
    if (session.user.username !== username && session.user.role !== 'ADMIN') {
        return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const body = await req.json();
    const { name, bio, avatarUrl } = body;
    const updated = await prisma.user.update({ where: { username: username }, data: { name, bio, avatarUrl }});

    return NextResponse.json(updated);
}

export async function DELETE(
    req: NextRequest, 
    { params }: { params: Promise<{ username: string }> }
) {
    const { username } = await params;

    const session = await getServerSession(authOptions);
    if (!session) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    } 
    if (session.user.username !== username) {
        return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    } 

    await prisma.user.delete({ where: { username: username } });
    return NextResponse.json({ success: true }, { status: 204 });
}