// app/api/auth/signup/route.ts

import { NextResponse } from 'next/server';
import { z }            from 'zod';
import bcrypt           from 'bcryptjs';
import { prisma }       from '@server/prisma';

const SignUpSchema = z.object({
  username: z.string().min(3,   'Username deve ter ao menos 3 caracteres'),
  name:     z.string().min(1,   'Nome é obrigatório'),
  email:    z.string().email(   'E-mail inválido'),
  password: z.string().min(6,   'Senha deve ter ao menos 6 caracteres'),
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const data = SignUpSchema.parse(body);

    // Verifica usuário ou e-mail já existentes
    const exists = await prisma.user.findFirst({
      where: {
        OR: [
          { username: data.username },
          { email:    data.email    },
        ],
      },
    });
    if (exists) {
      return NextResponse.json(
        { error: 'Username ou e-mail já cadastrado.' },
        { status: 409 }
      );
    }

    // Hash da senha
    const hashed = await bcrypt.hash(data.password, 12);

    // Cria no banco
    await prisma.user.create({
      data: {
        username:   data.username,
        name:       data.name,
        email:      data.email,
        password:   hashed,
        // avatarPath e bio podem ficar default pelo Prisma
      },
    });

    return NextResponse.json({ ok: true }, { status: 201 });
  } catch (err) {
    if (err instanceof z.ZodError) {
      // retorna somente o primeiro erro de validação
      return NextResponse.json(
        { error: err.errors[0].message, errors: err.errors },
        { status: 400 }
      );
    }
    console.error(err);
    return NextResponse.json(
      { error: 'Erro interno ao cadastrar usuário.' },
      { status: 500 }
    );
  }
}
