// api/comments/[commentId]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@server/auth';
import { prisma } from '@server/prisma';

export async function GET(
    req: NextRequest, 
    { params }: { params: Promise<{ commentId: string }> }
) {
    const { commentId } = await params;

    const comment = await prisma.comment.findUnique({ where: { commentId: commentId } });
    if (!comment) {
        return NextResponse.json({ error: 'Comment not found' }, { status: 404 });
    }

    return NextResponse.json(comment);
}

export async function PATCH(
    req: NextRequest, 
    { params }: { params: Promise<{ commentId: string }> }
) {
    const { commentId } = await params;

    const session = await getServerSession(authOptions);
    if (!session) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    } 
    
    const existing = await prisma.comment. findUnique({ where: { commentId: commentId } });
    if (!existing || existing.authorUsername !== session.user.username) {
        return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const { text } = await req.json();
    const updated = await prisma.comment.update({
        where: { commentId: commentId },
        data: { text }
    })
    
    return NextResponse.json(updated);
}

export async function DELETE(
    req: NextRequest,
    { params }: { params: Promise<{ commentId: string }> }
) {
    const { commentId } = await params;

    const session = await getServerSession(authOptions);
    if (!session) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const existing = await prisma.comment.findUnique({ where: { commentId: commentId } });
    if (!existing || existing.authorUsername !== session.user.username) {
        return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    await prisma.comment.delete({ where: { commentId: commentId } });
    
    return NextResponse.json({ success: true });
}