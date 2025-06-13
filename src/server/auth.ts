import type { NextAuthOptions } from 'next-auth';
import CredentialsProvider      from 'next-auth/providers/credentials';
import bcrypt                   from 'bcryptjs';
import { PrismaAdapter }        from '@next-auth/prisma-adapter';
import { prisma }               from '@server/prisma';

export const authOptions: NextAuthOptions = {
  // ── Adapter + estratégia de sessão ──────────────────────────
  adapter: PrismaAdapter(prisma),
  session: {
    strategy : 'jwt',
  },

  // ── Provider de credenciais ─────────────────────────────────
  providers: [
    CredentialsProvider({
      name: 'Credenciais',
      credentials: {
        username: { label: 'Usuário', type: 'text' },
        password: { label: 'Senha',   type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.username || !credentials.password) return null;

        const username = credentials.username.trim().toLowerCase();
        const user = await prisma.user.findUnique({ where: { username } });
        if (!user || !user.password) return null;

        const ok = await bcrypt.compare(credentials.password, user.password);
        if (!ok) return null;

        const avatar = user.avatarPath ?? '';

        // campos exigidos pelo seu módulo de tipagem
        return {
          id         : user.username,
          name       : user.name,
          email      : user.email,
          image      : avatar,      // campo padrão do NextAuth
          username   : user.username,
          avatarPath : avatar,
          bio        : user.bio ?? '',
        };
      },
    }),
  ],

  // ── Páginas customizadas ────────────────────────────────────
  pages: {
    signIn: '/auth/login',
    error : '/auth/login',
  },

  // ── Callbacks (propagam dados extras) ───────────────────────
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id         = user.username;
        token.username   = (user as any).username;
        token.avatarPath = (user as any).avatarPath;
        token.bio        = (user as any).bio;
      }
      return token;
    },

    async session({ session, token }) {
      session.user = {
        ...session.user,
        id         : token.id         as string,
        username   : token.username   as string,
        avatarPath : token.avatarPath as string,
        bio        : token.bio        as string,
      };
      return session;
    },
  },

  // ── Configuração do JWT ─────────────────────────────────────
  secret: process.env.NEXTAUTH_SECRET,

  cookies: {
    sessionToken: {
      name: 'next-auth.session-token',
      options: {
        httpOnly: true,
        sameSite: 'none',
        path: '/',
        secure: false,
      }
    }
  },
};
