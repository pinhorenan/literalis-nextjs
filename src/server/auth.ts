// File: src/server/auth.ts
import type { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import bcrypt from 'bcryptjs';
import { PrismaAdapter } from '@next-auth/prisma-adapter';
import { prisma } from '@server/prisma';
import type { AccountType } from '@prisma/client';

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  session: { strategy: 'jwt' },

  /* ---------- Providers ---------- */
  providers: [
    CredentialsProvider({
      name: 'Credenciais',
      credentials: {
        username: { label: 'Usuário', type: 'text' },
        password: { label: 'Senha', type: 'password' },
      },
      async authorize(creds) {
        if (!creds?.username || !creds.password) return null;

        const username = creds.username.trim().toLowerCase();
        const user = await prisma.user.findUnique({ where: { username } });
        if (!user || !user.password) return null;

        const ok = await bcrypt.compare(creds.password, user.password);
        if (!ok) return null;

        // Retorna os dados essenciais para o JWT
        return {
          id: user.username,
          username: user.username,
          name: user.name,
          email: user.email ?? '',
          avatarPath: user.avatarUrl ?? '',
          bio: user.bio ?? '',
          image: user.avatarUrl ?? '',
          role: user.role,
        };
      },
    }),
  ],

  pages: {
    signIn: '/login',
    error: '/login',
  },

  /* ---------- Callbacks ---------- */
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.username = (user as any).username;
        token.role = (user as any).role; // opcional, mas ajuda se quiser ler direto do token
      }
      return token;
    },

    async session({ session, token }) {
      if (!token.username) return session;

      const dbUser = await prisma.user.findUnique({
        where: { username: token.username as string },
        select: {
          username: true,
          name: true,
          email: true,
          avatarUrl: true,
          bio: true,
          role: true,
        },
      });

      if (dbUser) {
        session.user = {
          id: dbUser.username,
          username: dbUser.username,
          name: dbUser.name,
          email: dbUser.email ?? '',
          avatarPath: dbUser.avatarUrl,
          bio: dbUser.bio ?? '',
          image: dbUser.avatarUrl,
          role: dbUser.role as AccountType,
        };
      }

      return session;
    },
  },

  secret: process.env.NEXTAUTH_SECRET,
};
