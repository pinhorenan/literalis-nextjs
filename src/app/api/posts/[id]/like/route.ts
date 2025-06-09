import { getServerSession } from 'next-auth'
import { db } from '@/src/server/db'
import { json, conflict, serverError, unauthorized, noContent } from '@/src/server/http'
import { authOptions } from '@/src/server/auth'

export async function POST(_: Request, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) return unauthorized()

    await db.reaction.create({
      data: { type: 'LIKE', userId: session.user.id, postId: params.id },
    })

    // cria notificação se o autor do post ≠ quem curtiu
    const post = await db.post.findUnique({ where: { id: params.id } })
    if (post && post.authorId !== session.user.id) {
      await db.notification.create({
        data: {
          userId: post.authorId,
          actorId: session.user.id,
          postId: post.id,
          type: 'LIKE',
        },
      })
    }

    return json({ ok: true }, 201)
  } catch (e: any) {
    if (e.code === 'P2002') return conflict('Já curtiu')
    console.error(e);        return serverError()
  }
}

export async function DELETE() {
  // ctx.params não é necessário pois id já está na rota
  // query param "id" disponível em URL
  return noContent() // handler ilustrativo (similar ao POST com .delete)
}
