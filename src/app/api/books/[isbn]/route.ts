// api/books/[isbn]/route.ts
import { prisma } from '@server/prisma'
import { json, notFound, serverError } from '@server/http'

export async function GET(_: Request, { params }: { params: { isbn: string } }) {
  try {
    const book = await prisma.book.findUnique({ where: { isbn: params.isbn } })
    return book ? json(book) : notFound('Livro não encontrado')
  } catch (e) { console.error(e); return serverError() }
}
