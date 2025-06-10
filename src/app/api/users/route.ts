// api/users/route.ts
import { NextRequest } from 'next/server'
import { z } from 'zod'
import bcrypt from 'bcryptjs'
import { prisma } from '@server/prisma'
import { json, conflict, badRequest, serverError } from '@server/http'

const UserInput = z.object({
  username:   z.string().regex(/^[a-z0-9_]+$/i),
  name:       z.string().min(1),
  avatarPath: z.string().min(1),
  bio:        z.string().max(160).optional(),
  email:      z.string().email().optional(),
  password:   z.string().min(6).optional(),
})

export async function GET() {
  try {
    const users = await prisma.user.findMany({ orderBy: { name: 'asc' } })
    return json(users)
  } catch (e) { console.error(e); return serverError() }
}

export async function POST(req: NextRequest) {
  try {
    const data = UserInput.parse(await req.json())
    const hash = data.password ? await bcrypt.hash(data.password, 10) : null
    const user = await prisma.user.create({
      data: { ...data, password: hash ?? undefined },
    })
    return json(user, 201)
  } catch (e: any) {
    if (e.code === 'P2002')      return conflict('username ou e-mail já existe')
    if (e instanceof z.ZodError) return badRequest(e.message)
    console.error(e);            return serverError()
  }
}
