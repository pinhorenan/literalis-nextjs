import type { Metadata } from "next";
import React from "react";
import Header from "@/src/components/layout/Header";
import Footer from "@/src/components/layout/Footer";
import ThemeProvider from "./theme-provider";
import "@/src/styles/globals.css";

import { getServerSession } from "next-auth";
import { authOptions } from "@/src/server/auth";
import Providers from "./providers";

export const metadata: Metadata = {
  title: "Literalis",
  description: "Rede social literária",
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
  },
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const session = await getServerSession(authOptions);
  
  return (
    <html>
      <body className="min-h-screen min-w-screen">
        <Providers session={session}>
          <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
            <Header />
            <main className="flex-1">
              {children}
            </main>
            <Footer />
          </ThemeProvider>
        </Providers>
      </body>
    </html>
  );
}
