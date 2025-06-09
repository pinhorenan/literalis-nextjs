// app/api/users/[id]/follows/me/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/src/server/db';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/src/server/auth';

// 1) Interface para tipar o contexto recebido pelo handler
interface RouteContext {
  params: {
    id: string;
  };
}

// 2) Handler GET com tipagem explícita em req e context
export async function GET(
  req: NextRequest,
  context: RouteContext
): Promise<NextResponse> {
  const { id: followedId } = context.params;

  try {
    // 3) Busca sessão para saber quem é o follower
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      // não autenticado → diz que não segue
      return NextResponse.json({ follows: false });
    }
    const followerId = session.user.id;

    // 4) Verifica no banco
    const follow = await db.follow.findUnique({
      where: {
        followerId_followedId: { followerId, followedId },
      },
    });

    return NextResponse.json({ follows: Boolean(follow) });
  } catch (error) {
    console.error('Erro em GET /api/users/[id]/follows/me:', error);
    return new NextResponse('Erro interno', { status: 500 });
  }
}
