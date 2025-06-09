// app/api/users/[id]/route.ts

import { NextRequest } from 'next/server'
import { z, ZodError } from 'zod'
import { db } from '@/src/server/db'
import {
  json,
  notFound,
  serverError,
  noContent,
  badRequest,
} from '@/src/server/http'

// --- schema de PATCH (atualização de perfil) ---
const PatchUser = z.object({
  name:       z.string().min(1).optional(),
  avatarPath: z.string().min(1).optional(),
  bio:        z.string().max(160).optional(),
}).strict()

// --- GET: retorna usuário + posts + follower/following IDs ---
export async function GET(
  _req: NextRequest,
  { params }: { params: { id: string } }
) {
  const { id } = params
  try {
    // 1) Busca usuário e followers/following
    const raw = await db.user.findUnique({
      where: { id },
      select: {
        id: true,
        username: true,
        name: true,
        email: true,
        avatarPath: true,
        bio: true,
        followers: { select: { followerId: true } },
        following: { select: { followedId: true } },
      },
    })
    if (!raw) {
      return notFound('Usuário não encontrado')
    }

    // formata os arrays de IDs
    const user = {
      id: raw.id,
      username: raw.username,
      name: raw.name,
      email: raw.email,
      avatarPath: raw.avatarPath,
      bio: raw.bio,
      followerIds: raw.followers.map(f => f.followerId),
      followingIds: raw.following.map(f => f.followedId),
    }

    // 2) Busca posts do usuário com relações
    const posts = await db.post.findMany({
      where: { authorId: id },
      orderBy: { createdAt: 'desc' },
      include: {
        author: true,
        book: true,
        comments: {
          orderBy: { createdAt: 'asc' },
          include: { author: true },
        },
      },
    })

    return json({ user, posts })
  } catch (e) {
    console.error('GET /api/users/[id]:', e)
    return serverError()
  }
}

// --- PATCH: atualiza campos permitidos ---
export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const { id } = params
  try {
    const data = PatchUser.parse(await req.json())
    const updated = await db.user.update({
      where: { id },
      data,
    })
    return json(updated)
  } catch (e) {
    if (e instanceof ZodError) {
      return badRequest(e.errors.map(err => err.message).join(', '))
    }
    console.error('PATCH /api/users/[id]:', e)
    return serverError()
  }
}

// --- DELETE: remove o usuário ---
export async function DELETE(
  _req: NextRequest,
  { params }: { params: { id: string } }
) {
  const { id } = params
  try {
    await db.user.delete({ where: { id } })
    return noContent()
  } catch (e) {
    console.error('DELETE /api/users/[id]:', e)
    return serverError()
  }
}
