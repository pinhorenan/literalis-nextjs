import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/src/lib/prisma';

// POST /api/follows/ { followerId, followedId} -> seguir
export async function POST(request: NextRequest) {
    const { followerId, followedId} = await request.json();
    if (typeof followerId !== 'string' || typeof followedId !== 'string')
        return NextResponse.json({error: 'IDs inválidos.' }, { status: 400 });

    await prisma.follow.create({ data: { followerId, followedId } });
    return NextResponse.json({ ok: true }, { status: 201 });
}

// DELETE /api/follows?followerId=...&followedId=... -> deixar de seguir
export async function DELETE(request: NextRequest) {
    const { searchParams } = new URL(request.url);
    const followerId = searchParams.get('followerId');
    const followedId = searchParams.get('followedId');
    if (!followerId || !followedId)
        return NextResponse.json({ error: 'IDs obrigatórios' }, { status: 400 });

    await prisma.follow.delete({ where: { followerId_followedId: { followerId, followedId } } });
    return NextResponse.json({ ok: true });
}