// File: src/types/next-auth.d.ts
import { DefaultSession, DefaultUser } from 'next-auth'
import { AccountType } from '@prisma/client'

declare module 'next-auth' {
  interface Session {
    user: {
      id: string;
      username: string;
      name: string;
      email: string | null;
      avatarPath: string;
      bio?: string;
      image?: string;
      role: AccountType;
    };
  }

  interface User {
    id: string;
    username: string;
    name: string;
    email: string | null;
    avatarPath: string;
    bio?: string;
    image?: string;
    role: AccountType;
  }
}