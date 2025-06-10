// app/api/auth/[...nextauth]/route.ts
import NextAuth from "next-auth";
import GitHubProvider from "next-auth/providers/github";
import { authOptions } from "@/src/server/auth"; // ajuste o path se necessário

const handler = NextAuth({
  ...authOptions,
  providers: [
    GitHubProvider({ clientId: process.env.GH_ID!, clientSecret: process.env.GH_SECRET! }),
    // outros providers…
  ],
});

export { handler as GET, handler as POST };
