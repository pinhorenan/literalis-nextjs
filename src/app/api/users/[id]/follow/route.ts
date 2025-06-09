import { getServerSession } from 'next-auth'
import { db } from '@/src/server/db'
import { json, conflict, serverError, unauthorized, noContent } from '@/src/server/http'
import { authOptions } from '@/src/server/auth'

export async function POST(_: Request, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) return unauthorized()
    if (session.user.id === params.id) return conflict('Você não pode seguir a si mesmo')

    await db.follow.create({
      data: { followerId: session.user.id, followedId: params.id },
    })

    await db.notification.create({
      data: {
        userId: params.id,
        actorId: session.user.id,
        type: 'FOLLOW',
      },
    })

    return json({ ok: true }, 201)
  } catch (e: any) {
    if (e.code === 'P2002') return conflict('Já segue esse usuário')
    console.error(e);       return serverError()
  }
}

export async function DELETE(_: Request, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) return unauthorized()

    await db.follow.delete({
      where: { followerId_followedId: { followerId: session.user.id, followedId: params.id } },
    })
    return noContent()
  } catch (e) { console.error(e); return serverError() }
}
