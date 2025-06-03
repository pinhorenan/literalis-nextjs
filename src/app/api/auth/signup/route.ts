import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/src/lib/prisma';

export async function POST(request: NextRequest) {
    try {
        const { email, name, password } = await request.json();
        if (
            typeof email !== 'string' ||
            typeof name !== 'string' ||
            typeof password !== 'string'
        ) {
            return NextResponse.json({ error: 'Dados inválidos' }, { status: 400 });
        }

        // Verifica se o usuário já existe
        const existing = await prisma.user.findUnique({ where: { email } });	
        if (existing) {
            return NextResponse.json({ error: 'Email já cadastrado' }, { status: 409 });
        }

        // Cria o novo usuário
        const newUser = await prisma.user.create({
            data: { email, name, password, username: email.split('@')[0] },
        });

        return NextResponse.json({ ok: true, userId: newUser.id }, { status: 201 });
    } catch (error) {
        console.error('POST /api/auth/signup error:', error);
        return NextResponse.json({ error: 'Falha no cadastro' }, { status: 500 });
    }
}