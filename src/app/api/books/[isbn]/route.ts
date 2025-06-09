import { db } from '@/src/server/db'
import { json, notFound, serverError } from '@/src/server/http'

export async function GET(_: Request, { params }: { params: { isbn: string } }) {
  try {
    const book = await db.book.findUnique({ where: { isbn: params.isbn } })
    return book ? json(book) : notFound('Livro não encontrado')
  } catch (e) { console.error(e); return serverError() }
}
