// types/next-auth.d.ts
import { DefaultSession, DefaultUser } from 'next-auth'

declare module 'next-auth' {
  interface Session extends DefaultSession {
    user: DefaultSession['user'] & {
      id: string
      username: string
      avatarPath: string
      bio?: string
    }
  }

  interface User extends DefaultUser {
    username: string
    avatarPath: string
    bio?: string
  }
}
