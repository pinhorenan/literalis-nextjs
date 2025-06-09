import type { NextAuthOptions } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import bcrypt from "bcryptjs";
import { db } from "@/src/server/db";

export const authOptions: NextAuthOptions = {
  // ───────────────────────────────────────────────────────────────
  adapter: PrismaAdapter(db),          // ainda usamos o adapter ⇠ User no DB
  session: { strategy: "jwt" },        // ⇦ trocado para JWT
  // ───────────────────────────────────────────────────────────────

  providers: [
    Credentials({
      name: "Credentials",
      credentials: {
        username: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials) return null;

        const user = await db.user.findUnique({
          where: { username: credentials.username },
        });
        if (!user || !user.password) return null;

        const ok = await bcrypt.compare(credentials.password, user.password);
        if (!ok) return null;

        // Campos enviados para o JWT
        return {
          id: user.id,
          name: user.name,
          email: user.email,
          image: user.avatarPath,
        };
      },
    }),
  ],

  pages: { signIn: "/login" },

  callbacks: {
    // grava id no token
    async jwt({ token, user }) {
      if (user) token.id = user.id;
      return token;
    },
    // expõe id no session.user
    async session({ session, token }) {
      if (token?.id) (session.user as any).id = token.id;
      return session;
    },
  },

  secret: process.env.NEXTAUTH_SECRET, // já deve existir
};
