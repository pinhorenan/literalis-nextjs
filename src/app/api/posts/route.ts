// app/api/posts/route.ts
import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/src/lib/prisma';

// GET /api/posts?feed=friends&userId=123
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const feed = searchParams.get('feed') ?? 'discover';
    const user = searchParams.get('userId');

    const where =
      feed === 'friends' && user
        ? { author: { followers: { some: { followerId: user } } } }
        : {};

    const posts = await prisma.post.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      include: {
        author: true,
        book: true,
        comments: { include: { author: true } },
      },
    });

    return NextResponse.json(posts);
  } catch (error: any) {
    console.error('GET /api/posts error:', error);
    return NextResponse.json({ error: 'Erro ao buscar posts.' }, { status: 500 });
  }
}

// POST /api/posts
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validações básicas
    if (
      typeof body.authorId    !== 'string' ||
      typeof body.bookIsbn    !== 'string' ||
      typeof body.excerpt     !== 'string' ||
      typeof body.progressPct !== 'number'
    ) {
      return NextResponse.json(
        { error: 'authorId, bookIsbn, excerpt e progressPct são obrigatórios.' },
        { status: 400 }
      );
    }

    const post = await prisma.post.create({
      data: {
        authorId:     body.authorId,
        bookIsbn:     body.bookIsbn,
        excerpt:      body.excerpt,
        progressPct:  body.progressPct,
      },
      include: { author: true, book: true, comments: { include: { author: true } } },
    });

    return NextResponse.json(post, { status: 201 });
  } catch (error: any) {
    console.error('POST /api/posts error:', error);
    return NextResponse.json({ error: 'Erro ao criar post.' }, { status: 500 });
  }
}
