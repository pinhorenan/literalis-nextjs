// api/posts/[postId]/comments/route.ts
import { NextResponse }     from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions }      from '@server/auth';
import { prisma }           from '@server/prisma';

export async function POST(req: Request, { params }: { params: { postId: string } }) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { postId } = params;
  const { text }  = await req.json() as { text: string };
  if (!text?.trim()) {
    return NextResponse.json({ error: 'Texto vazio' }, { status: 400 });
  }

  const [comment] = await prisma.$transaction([
    prisma.comment.create({
      data: {
        text,
        authorId: session.user.id,
        postId,
      },
      include: { author: true },
    }),
    prisma.post.update({
      where: { id: postId },
      data:  { commentsCount: { increment: 1 } },
    }),
  ]);

  return NextResponse.json(comment, { status: 201 });
}
