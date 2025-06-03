// app/api/comments/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

/**
 * GET /api/comments.?postId=123
 * Se houver query 'postId', devolve só os comentários daquele post.
 * Senão, devolve todos (ou então limite por página/offset etc).
 */
export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const postId = searchParams.get('postId');

        let comments;
        if (postId) {
            // busca todos os comentários onde post_id = postId
            comments = await prisma.comment.findMany({
                where: { postId: postId },
                orderBy: { createdAt: 'desc' },
            });
        } else {
            // ou busca todos
            comments = await prisma.comment.findMany({
                orderBy: { createdAt: 'desc' },
            });
        }

        return NextResponse.json(comments, { status: 200 });	
    } catch (error: any) {
        console.error('GET /api/comments error:', error);
        return NextResponse.json(
            { error: 'Erro ao buscar comentários.' },
            { status: 500 }
        );
    }
}

/**
 * POST /api/comments
 * Body JSON esperado:
 * {
 *  "postId": "4",
 *  "authorId": "ana",
 *  "text": "Também amo esse livro!",
 * }
 */
export async function POST(request: NextRequest) {
    try {
        const data = await request.json();
        // Validações básicas
        if (
            typeof data.postId !== 'string' ||
            typeof data.authorId !== 'string' ||
            typeof data.text !== 'string'
        ) {
            return NextResponse.json(
                { error: 'postId, authorId e text são obrigatórios.' },
                { status: 400 }
            );
        }

    // Cria o comentário no banco
    const newComment = await prisma.comment.create({
        data: {
            postId: data.postId,
            authorId: data.authorId,
            text: data.text,
            // 'createdAt' será preenchido automaticamente pelo default(now())
        },
    });

    return NextResponse.json(newComment, { status: 201 });
    } catch (error: any) {
        console.error('POST /api/comments error:', error);
        return NextResponse.json(
            { error: 'Erro ao criar comentário.' },
            { status: 500 }
        );
    }
}