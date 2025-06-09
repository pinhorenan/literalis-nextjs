import { NextRequest } from 'next/server'
import { getServerSession } from 'next-auth'
import { z } from 'zod'
import { db } from '@/src/server/db'
import { json, notFound, serverError, unauthorized, badRequest, noContent } from '@/src/server/http'
import { authOptions } from '@/src/server/auth'

const PatchPost = z.object({
  excerpt:     z.string().optional(),
  progressPct: z.number().int().min(0).max(100).optional(),
})

export async function GET(_: Request, { params }: { params: { id: string } }) {
  try {
    const post = await db.post.findUnique({
      where: { id: params.id },
      include: {
        author: true,
        book: true,
        comments: { include: { author: true } },
        reactions: { select: { type: true, userId: true } },
      },
    })
    return post ? json(post) : notFound('Post não existe')
  } catch (e) { console.error(e); return serverError() }
}

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) return unauthorized()

    const post = await db.post.findUnique({ where: { id: params.id } })
    if (!post) return notFound()

    if (post.authorId !== session.user.id) return unauthorized()

    const data = PatchPost.parse(await req.json())
    const updated = await db.post.update({ where: { id: params.id }, data })
    return json(updated)
  } catch (e: any) {
    if (e instanceof z.ZodError) return badRequest(e.message)
    console.error(e); return serverError()
  }
}

export async function DELETE(_: Request, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) return unauthorized()

    const post = await db.post.findUnique({ where: { id: params.id } })
    if (!post) return notFound()
    if (post.authorId !== session.user.id) return unauthorized()

    await db.post.delete({ where: { id: params.id } })
    return noContent()
  } catch (e) { console.error(e); return serverError() }
}
