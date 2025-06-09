// src/app/api/posts/[id]/comments/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { z } from 'zod';

import { db } from '@/src/server/db';
import { authOptions } from '@/src/server/auth';

const CommentInput = z.object({
  text: z.string().min(1, 'Comentário vazio'),
});

/**
 * POST /api/posts/[id]/comments
 * Body: { text: string }
 */
export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } },
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { text } = CommentInput.parse(await req.json());
    const postId = params.id;

    const [comment] = await db.$transaction([
      // 1) cria comentário
      db.comment.create({
        data: {
          text,
          postId,
          authorId: session.user.id,
        },
        include: {
          author: true,
        },
      }),
      // 2) incrementa contador
      db.post.update({
        where: { id: postId },
        data: { commentsCount: { increment: 1 } },
      }),
    ]);

    return NextResponse.json(comment, { status: 201 });
  } catch (e: any) {
    console.error(e);
    if (e instanceof z.ZodError) {
      return NextResponse.json({ error: e.message }, { status: 400 });
    }
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
