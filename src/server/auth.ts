// File: src/server/auth.ts
import type { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import bcrypt from 'bcryptjs';
import { PrismaAdapter } from '@next-auth/prisma-adapter';
import { prisma } from '@server/prisma';

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  session: { strategy: 'jwt' },

  /* ---------- Providers ---------- */
  providers: [
    CredentialsProvider({
      name: 'Credenciais',
      credentials: {
        username: { label: 'Usuário', type: 'text' },
        password: { label: 'Senha',   type: 'password' },
      },
      async authorize(creds) {
        if (!creds?.username || !creds.password) return null;

        const username = creds.username.trim().toLowerCase();
        const user = await prisma.user.findUnique({ where: { username } });
        if (!user || !user.password) return null;

        const ok = await bcrypt.compare(creds.password, user.password);
        if (!ok) return null;

        /*  → Retorne só o mínimo; o resto buscamos no callback session  */
        return { 
          id: user.username, 
          username: user.username,
          name: user.name,
          email: user.email ?? '',
          avatarPath: user.avatarPath ?? '',
          bio: user.bio ?? '',
          image: user.avatarPath ?? '',
        };
      },
    }),
  ],

  pages: {
    signIn: '/login',
    error : '/login',
  },

  /* ---------- Callbacks ---------- */
  callbacks: {
    /* JWT armazena só a chave de lookup */
    async jwt({ token, user }) {
      if (user) token.username = (user as any).username;
      return token;
    },

    /* Session sempre lê o usuário “fresco” do banco */
    async session({ session, token }) {
      if (!token.username) return session;

      const dbUser = await prisma.user.findUnique({
        where: { username: token.username as string },
        select: {
          username: true,
          name:     true,
          email:    true,
          avatarPath: true,
          bio:      true,
        },
      });

      if (dbUser) {
        session.user = {
          id:         dbUser.username,      // seu @id
          username:   dbUser.username,
          name:       dbUser.name,
          email:      dbUser.email ?? '',
          avatarPath: dbUser.avatarPath,
          bio:        dbUser.bio ?? '',
          image:      dbUser.avatarPath,    // conveniência p/ <Image>
        };
      }
      return session;
    },
  },

  secret: process.env.NEXTAUTH_SECRET,
};
