import NextAuth from 'next-auth';
import { PrismaAdapter } from '@next-auth/prisma-adapter';
import GithubProvider from 'next-auth/providers/github';
import GoogleProvider from 'next-auth/providers/google';
import CredentialsProvider from 'next-auth/providers/credentials';
import prisma from '@/src/lib/prisma';
import bcrypt from 'bcrypt';
import { signIn } from 'next-auth/react';

export const authOptions = {
    adapter: PrismaAdapter(prisma),

    // 1) Github OAuth
    providers: [
        GithubProvider({
            clientId: process.env.GITHUB_ID || '',
            clientSecret: process.env.GITHUB_SECRET || '',
        }),

        // 2) Google OAuth
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID || '',
            clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
        }),

        // 3) Credenciais (email e senha)
        CredentialsProvider({
            name: 'Credentials',
            credentials: {
                email: { label: "Email", type: "email" },
                password: { label: "Senha", type: "password" },
            },
            async authorize(credentials) {
                if (!credentials?.email || !credentials?.password) {
                    return null;
                }

                // Busca o usuário pelo email
                const user = await prisma.user.findUnique({
                    where: { email: credentials.email },
                });
                if (!user || !user.password) {
                    return null; // Usuário não encontrado ou sem senha
                }
                // Verifica a senha
                const isValid = await bcrypt.compare(credentials.password, user.password);
                if (!isValid) {
                    return null; // Senha inválida
                }
                return { id: user.id, name: user.name, email: user.email, avatarPath: user.avatarPath };
            },
        }),
    ],

    pages: {
        signIn: '/auth/signin',
        newUser: '/auth/signup',
        error: '/auth/error', // Exibe erros de autenticação
    },

    callbacks: {
        async session({ session, user }) {
            // Adiciona o ID do usuário no objeto de sessão
            if(session.user) {
                session.user.id = user.id;
                session.user.avatarPath = user.avatarPath || null;
            }
            return session;
        },
        async jwt({ token, user }) {
            // Durante o login, atribui o ID no token
            if (user) {
                token.id = user.id;
                token.avatarPath = user.avatarPath || null;
            }
            return token;
        },

    },
        secret: process.env.NEXTAUTH_SECRET,
};

    const handler = NextAuth(authOptions);
    export { handler as GET, handler as POST };