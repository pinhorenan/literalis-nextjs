// api/posts/route.ts
import { NextResponse }          from 'next/server';
import { getServerSession }      from 'next-auth';
import { prisma }                from '@server/prisma';
import { authOptions }           from '@server/auth';

/** GET /api/posts — feed “discover” (padrão) */
export async function GET() {
  try {
    const posts = await prisma.post.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        author: true,
        book:   true,
        comments: {
          include: { author: true },
          orderBy: { createdAt: 'asc' },
        },
      },
    });
    return NextResponse.json(posts);
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'Erro no servidor' }, { status: 500 });
  }
}

/** POST /api/posts — cria um novo Post */
export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: 'Não autenticado' }, { status: 401 });
  }

  const body = await req.json() as {
    bookIsbn:   string;
    excerpt:    string;
    progressPct:number;
  };

  try {
    const post = await prisma.post.create({
      data: {
        authorId:  session.user.id,
        ...body,
      },
      include: { author: true, book: true, comments: true },
    });
    return NextResponse.json(post, { status: 201 });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'Falha ao criar post' }, { status: 400 });
  }
}
