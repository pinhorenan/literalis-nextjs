// api/users/[username]/follow/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@server/auth';
import { prisma } from '@server/prisma';

export async function GET(
    req: NextRequest, 
    { params }: { params: Promise<{ username: string }> }
) {
    const { username } = await params;

    const session = await getServerSession(authOptions);
    if (!session) {
        return NextResponse.json({ following: false }, { status: 401 });
    } 

    const exists = await prisma.follow.findUnique({
        where: { followerUsername_followedUsername: { followerUsername: session.user.username, followedUsername: username } },
    });

    return NextResponse.json({ following: Boolean(exists) });
}

export async function POST(
    req: NextRequest, 
    { params }: { params: Promise<{ username: string }> }
) {
    const { username } = await params;
    
    const session = await getServerSession(authOptions);
    if (!session) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    } 

    const follow = await prisma.follow.create({
        data: { followerUsername: session.user.username, followedUsername: username }
    });

    return NextResponse.json(follow);
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

    await prisma.follow.delete({
        where: { followerUsername_followedUsername: { followerUsername: session.user.username, followedUsername: username }},
    });
    
    return NextResponse.json({ success: true });
}
