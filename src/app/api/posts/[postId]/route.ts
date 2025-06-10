// api/posts/[postId]/route.ts
import { NextResponse }     from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions }      from '@server/auth';
import { prisma }           from '@server/prisma';

export async function GET(_: Request, { params }: { params: { postId: string } }) {
  const { postId } = params;
  const post = await prisma.post.findUnique({
    where: { id: postId },
    include: {
      author: true,
      book:   true,
      comments: { include: { author: true } },
    },
  });
  return post
    ? NextResponse.json(post)
    : NextResponse.json({ error: 'Post não encontrado' }, { status: 404 });
}

/** PUT (editar) e DELETE (remover) exigem dono */
export async function PUT(req: Request, { params }: { params: { postId: string } }) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { postId } = params;
  const body       = await req.json() as { excerpt?: string; progressPct?: number };

  /** garante que só o autor edite */
  const post = await prisma.post.findUnique({ where: { id: postId } });
  if (!post || post.authorId !== session.user.id)
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

  const updated = await prisma.post.update({
    where: { id: postId },
    data:  { ...body },
    include: { author: true, book: true, comments: true },
  });
  return NextResponse.json(updated);
}

export async function DELETE(_: Request, { params }: { params: { postId: string } }) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { postId } = params;
  const post = await prisma.post.findUnique({ where: { id: postId } });
  if (!post || post.authorId !== session.user.id)
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

  await prisma.post.delete({ where: { id: postId } });
  return NextResponse.json({ deleted: true });
}
