import { NextRequest } from 'next/server'
import { getServerSession } from 'next-auth'
import { z } from 'zod'
import { db } from '@/src/server/db'
import { json, badRequest, unauthorized, serverError } from '@/src/server/http'
import { authOptions } from '@/src/server/auth'

const ShelfInput = z.object({
  bookIsbn: z.string(),
  progress: z.number().int().min(0).max(100).optional(),
})

export async function GET(_: NextRequest, { params }: { params: { id: string } }) {
  try {
    const shelf = await db.userBook.findMany({
      where: { userId: params.id },
      include: { book: true },
      orderBy: { addedAt: 'desc' },
    })
    return json(shelf)
  } catch (e) { console.error(e); return serverError() }
}

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions)
    if (!session || session.user.id !== params.id) return unauthorized()

    const body = ShelfInput.parse(await req.json())
    const entry = await db.userBook.upsert({
      where: { userId_bookIsbn: { userId: params.id, bookIsbn: body.bookIsbn } },
      create: { userId: params.id, ...body },
      update: body.progress ? { progress: body.progress } : {},
      include: { book: true },
    })
    return json(entry, 201)
  } catch (e: any) {
    if (e instanceof z.ZodError) return badRequest(e.message)
    console.error(e); return serverError()
  }
}
