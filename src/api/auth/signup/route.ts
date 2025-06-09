// api/auth/signup/route.ts
import { NextResponse } from "next/server";
import { z, ZodError } from "zod";
import { db } from "@server/db";
import { hash } from "bcryptjs";

// --- esquema de validação ---
const signupSchema = z
  .object({
    username: z.string().min(1, "Username é obrigatório"),
    name: z.string().min(1, "Nome é obrigatório"),
    email: z.string().email("E-mail inválido").optional().nullable(),
    password: z.string().min(6, "Senha precisa ter pelo menos 6 caracteres"),
    // ↓ campos opcionais com defaults
    avatarPath: z.string().optional().default("/assets/images/users/default.jpg"),
    bio: z.string().optional().nullable(),
  })
  .strict(); // rejeita chaves extras

// --- rota POST ---
export async function POST(req: Request) {
  try {
    // 1) parse + defaults
    const data = signupSchema.parse(await req.json());
    const { username, name, email, password, avatarPath, bio } = data;

    // 2) checa duplicados
    const exists = await db.user.findFirst({
      where: {
        OR: [
          { username },
          email ? { email } : undefined,
        ].filter(Boolean) as any[],
      },
    });
    if (exists)
      return NextResponse.json(
        { error: "Username ou e-mail já em uso." },
        { status: 409 },
      );

    // 3) hash da senha
    const hashed = await hash(password, 10);

    // 4) cria usuário
    const user = await db.user.create({
      data: { username, name, email, password: hashed, avatarPath, bio },
    });

    // 5) resposta (201 Created)
    return NextResponse.json(
      { id: user.id, username: user.username, email: user.email },
      { status: 201 },
    );
  } catch (err) {
    if (err instanceof ZodError) {
      return NextResponse.json({ errors: err.errors }, { status: 400 });
    }
    console.error("signup error:", err);
    return NextResponse.json(
      { error: "Erro interno do servidor." },
      { status: 500 },
    );
  }
}
