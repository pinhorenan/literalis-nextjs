// app/api/users/route.ts
import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/src/lib/prisma';

/**
 * GET /api/users?usersId=abc
 * Se houver query 'usersId', devolve só os usuários com esses IDs.
 * Senão, devolve todos os usuários.
 */
export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const userId = searchParams.get('userId');

        let users;
        if (userId) {
            // Busca um único usuário por ID
            const user = await prisma.user.findUnique({
                where: { id: userId },
            });
            if (!user) {
                return NextResponse.json(
                    { error: 'Usuário com id="${userId}" não encontrado.' },
                    { status: 404 }
                );
            }
            users = user;
        } else {
            // Busca todos os usuários
            users = await prisma.user.findMany({
                orderBy: { name: 'asc' },
            });
        }

        return NextResponse.json(users, { status: 200 });
    } catch (error: any) {
        console.error('GET /api/users error:', error);
        return NextResponse.json(
            { error: 'Erro ao buscar usuários.' },
            { status: 500 }
        );
    }
}

/**
 * POST /api/users
 * Body JSON esperado:
 * {
 * "username": "pinhorenan",
 * "name"; "Renan Pinho",
 * "avatarPath": "/assets/users/pinhorenan.jpg",
 * }
 */
export async function POST(request: NextRequest) {
    try {
        const data = await request.json();

        // vALIDAÇÕES BÁSICAS
        if (
            typeof data.username    !== 'string' ||
            typeof data.name        !== 'string' ||
            typeof data.avatarPath  !== 'string'
        ) {
            return NextResponse.json(
                { error: 'username, name e avatarPath são obrigatórios.' },
                { status: 400 }
            );
        }

        // Cria o usuário no banco
        const newUser = await prisma.user.create({
            data: {
                username:   data.username,
                name:       data.name,
                avatarPath: data.avatarPath,
            },
    });

    return NextResponse.json(newUser, { status: 201 });
    } catch (error: any) {
        console.error('POST /api/users error:', error);
        // Caso ultra violação de unique (por ex., username duplicado)
        if (error.code === 'P2002') {
            return NextResponse.json(
                { error: 'Username já existe.' },
                { status: 409 }
            );
        }
        return NextResponse.json(
            { error: 'Erro ao criar usuário.' },
            { status: 500 }
        );
    }
}