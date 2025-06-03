import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Header } from '@/src/components/layout/Header';
import { Footer } from '@/src/components/layout/Footer';
import "@/src/styles/globals.css";

export const metadata: Metadata = {
  title: "Literalis",
  description: "Rede social literária",
  icons: {
    icon: "./favicon.svg",
    shortcut: "./favicon.svg",
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" className={'${geistSans.variable} ${geistMono.variable}'}>
      <body className="antialiased bg-background text-foreground">
        <Header />
        <div className="container mx-auto px-4">
          
          <main className="flex flex-col flex-1">{children}</main>
        </div>
        <Footer />
      </body>
    </html>
  );
}
