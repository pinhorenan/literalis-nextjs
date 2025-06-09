// api/books/route.ts
import { NextRequest } from 'next/server'
import { z } from 'zod'
import { db } from '@server/db'
import { json, conflict, badRequest, serverError } from '@server/http'

const BookInput = z.object({
  isbn:            z.string().min(5),
  title:           z.string(),
  author:          z.string(),
  publisher:       z.string(),
  edition:         z.number().int().gte(1),
  pages:           z.number().int().gte(1),
  language:        z.string(),
  publicationDate: z.coerce.date(),
  coverPath:       z.string(),
})

/**
 * GET /api/books
 * Retorna diretamente um array de Book[]
 */
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const take   = Number(searchParams.get('take')  ?? '20')
    const cursor = searchParams.get('cursor') ?? undefined

    const books = await db.book.findMany({
      orderBy: { title: 'asc' },
      take,
      ...(cursor && { skip: 1, cursor: { isbn: cursor } }),
    })

    // **Aqui retornamos diretamente o array**, não um objeto { data, nextCursor }
    return json(books)
  } catch (e) {
    console.error(e)
    return serverError()
  }
}

/**
 * POST /api/books
 * Cria um novo livro e devolve o objeto criado
 */
export async function POST(req: NextRequest) {
  try {
    const data = BookInput.parse(await req.json())

    const book = await db.book.create({ data })

    return json(book, 201)
  } catch (e: any) {
    // Unique constraint violation: ISBN já existe
    if (e.code === 'P2002')      return conflict('ISBN já cadastrado')
    if (e instanceof z.ZodError) return badRequest(e.message)

    console.error(e)
    return serverError()
  }
}
