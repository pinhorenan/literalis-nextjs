// api/post/[postId]/comments/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@server/auth';
import { prisma } from '@server/prisma';

export async function GET(req: NextRequest, { params }: { params: { postId: string } }) {
    const { postId } = params;
    
    const comments = await prisma.comment.findMany({
        where: { postId: postId },
        include: { author: { select: { username: true, name: true, avatarPath: true } } },
        orderBy: { createdAt: 'asc' }
    });
    return NextResponse.json(comments);
}

export async function POST(req: NextRequest, { params }: { params: { postId: string } }) {
    const { postId } = params;
    
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { text } = await req.json();
    const comment = await prisma.comment.create({
        data: {
            authorUsername: session.user.username,
            postId: postId,
            text
        },
        include: {
            author: {
                select: {
                    username: true,
                    name: true,
                    avatarPath: true
                }
            }
        }
    });

    await prisma.post.update({
        where: { postId },
        data: { commentCount: { increment: 1 } }
    })

    return NextResponse.json(comment);
}