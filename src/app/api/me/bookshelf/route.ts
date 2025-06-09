import { NextRequest } from 'next/server'
import { z } from 'zod'
import { db } from '@/src/server/db'
import { json, badRequest, serverError } from '@/src/server/http'

const USER_ID = 'mock-my-id'

export async function GET() {
  try {
    const items = await db.userBook.findMany({
      where:  { userId: USER_ID },
      include: { book: true },
      orderBy:{ addedAt: 'desc' },
    })
    return json(items)
  } catch (e) {
    console.error(e)
    return serverError()
  }
}

export async function POST(req: NextRequest) {
  try {
    const { bookIsbn } = z
      .object({ bookIsbn: z.string() })
      .parse(await req.json())

    await db.userBook.upsert({           // ← singular aqui
      where:  { userId_bookIsbn: { userId: USER_ID, bookIsbn } },
      update: {},
      create: { userId: USER_ID, bookIsbn },
    })

    return json({}, 201)
  } catch (e: any) {
    if (e instanceof z.ZodError) return badRequest(e.message)
    console.error(e)
    return serverError()
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const { bookIsbn, progress } = z
      .object({
        bookIsbn: z.string(),
        progress: z.number().int().min(0).max(100),
      })
      .parse(await req.json())

    await db.userBook.update({           // ← singular
      where: { userId_bookIsbn: { userId: USER_ID, bookIsbn } },
      data:  { progress },
    })
    return json({ ok: true })
  } catch (e: any) {
    if (e instanceof z.ZodError) return badRequest(e.message)
    console.error(e)
    return serverError()
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const bookIsbn = z.string().parse(searchParams.get('bookIsbn'))

    await db.userBook.delete({           // ← singular
      where: { userId_bookIsbn: { userId: USER_ID, bookIsbn } },
    })
    return json({}, 204)
  } catch (e) {
    console.error(e)
    return serverError()
  }
}
