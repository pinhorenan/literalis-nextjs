import { NextRequest } from 'next/server'
import { getServerSession } from 'next-auth'
import { z } from 'zod'
import { db } from '@/src/server/db'
import { json, badRequest, serverError, unauthorized } from '@/src/server/http'
import { authOptions } from '@/src/server/auth'

const PostInput = z.object({
  bookIsbn:    z.string(),
  excerpt:     z.string(),
  progressPct: z.number().int().min(0).max(100),
})

/* ───────────── GET /api/posts ───────────── */
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)

    const authorId   = searchParams.get('authorId') ?? undefined
    const bookIsbn   = searchParams.get('bookIsbn')   ?? undefined
    const onlyFriends = searchParams.get('friends') === '1'

    const take   = Number(searchParams.get('take')   ?? '20')
    const cursor = searchParams.get('cursor') ?? undefined

    const where: any = {
      ...(authorId && { authorId }),
      ...(bookIsbn && { bookIsbn }),
    }

    if (onlyFriends) {
      const session = await getServerSession(authOptions)
      if (session) {
        where.author = {
          followers: { some: { followerId: session.user.id } },
        }
      }
    }

    const posts = await db.post.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      take,
      ...(cursor && { skip: 1, cursor: { id: cursor } }),
      include: {
        author:   true,
        book:     true,
        comments: { include: { author: true } },
        // agora traz também a contagem de comentários
        _count: {
          select: {
            reactions: true,
            comments:  true,
          },
        },
      },
    })

    return json(posts)

  } catch (e) {
    console.error(e)
    return serverError()
  }
}

/* ───────────── POST /api/posts ───────────── */
export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) return unauthorized()

    const body = PostInput.parse(await req.json())

    const post = await db.post.create({
      data: { ...body, authorId: session.user.id },
      include: {
        author:   true,
        book:     true,
        // opcional: já incluir _count no retorno de criação também
        _count: {
          select: {
            reactions: true,
            comments:  true,
          },
        },
      },
    })

    return json(post, 201)
  } catch (e: any) {
    if (e instanceof z.ZodError) return badRequest(e.message)
    console.error(e)
    return serverError()
  }
}
