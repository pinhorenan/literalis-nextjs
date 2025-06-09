import { NextResponse } from 'next/server'

export const json = (data: unknown, status = 200) =>
  NextResponse.json(data, { status })

export const noContent = () => new NextResponse(null, { status: 204 })

export const badRequest   = (msg = 'Bad request')   => json({ error: msg }, 400)
export const unauthorized = (msg = 'Unauthorized')  => json({ error: msg }, 401)
export const notFound     = (msg = 'Not found')     => json({ error: msg }, 404)
export const conflict     = (msg = 'Conflict')      => json({ error: msg }, 409)
export const serverError  = (msg = 'Server error')  => json({ error: msg }, 500)
