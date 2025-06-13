// api/posts/[postId]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@server/auth';
import { prisma } from '@server/prisma';

export async function GET(
    req: NextRequest, 
    { params }: { params: Promise<{ postId: string }> }
) {
    const { postId } = await params;

    const post = await prisma.post.findUnique({
        where: { postId: postId },
        include: {
            author: true,
            book: true,
            comments: { orderBy: { createdAt: 'asc' }, },
            likes: { select: { username: true } }
        }
    });

    if (!post) {
        return NextResponse.json({ error: 'Post not found' }, { status: 404 });
    } 
        
    return NextResponse.json(post);
}

export async function PATCH(
    req: NextRequest, 
    { params }: { params: Promise<{ postId: string }> }
) {
    const { postId } = await params;
    
    const session = await getServerSession(authOptions);
    if (!session) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    } 
    
    const existing = await prisma.post.findUnique(
        { where: { postId: postId } }
    );
    if (!existing || existing.authorUsername !== session.user.username) {
        return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const { excerpt, progressPct } = await req.json();
    const updated = await prisma.post.update({
        where: { postId: postId },
        data: { excerpt, progressPct }
    });
    
    return NextResponse.json(updated);
}

export async function DELETE(
    req: NextRequest, 
    { params }: { params: Promise<{ postId: string }> }
) {
    const { postId } = await params;
    
    const session = await getServerSession(authOptions);
    if (!session) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    } 
    const existing = await prisma.post.findUnique(
        { where: { postId: postId } }
    );
    if (!existing || existing.authorUsername !== session.user.username) {
        return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    await prisma.post.delete({ where: { postId: postId } });
    
    return NextResponse.json({ success: true });
}
