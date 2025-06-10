// api/users/[userId]/route.ts
import { NextRequest } from 'next/server';
import { prisma } from '@server/prisma';
import { json, notFound, serverError } from '@server/http';

interface Params { params: { username: string } }

export async function GET(req: NextRequest, { params }: Params) {
  try {
    const user = await prisma.user.findUnique({
      where: { username: params.username },
      include: { posts: true }
    });
    if (!user) return notFound();
    return json({ user, posts: user.posts });
  } catch (e) {
    console.error(e);
    return serverError();
  }
}
