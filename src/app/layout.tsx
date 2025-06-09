// app/layout.tsx
import React                from 'react';
import { getServerSession } from 'next-auth';
import type { Metadata }    from 'next';

import Header from          '@components/layout/Header';
import Footer from          '@components/layout/Footer';
import ThemeProvider from   '@app/theme-provider';
import Providers from       '@app/providers';
import { authOptions } from '@server/auth';

import '@styles/globals.css';

export const metadata: Metadata = {
  title: 'Literalis',
  description: 'Rede social literária',
  icons: {
    icon: '/favicon.svg',
    shortcut: '/favicon.svg',
  },
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);

  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <body className="min-h-screen min-w-screen font-sans antialiased bg-[var(--surface-base)] text-[var(--text-primary)]">
        <Providers session={session}>
          <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
            {/* Header global e fixo */}
            <Header translucent />

            {/* Offset p/ não sobrepor o conteúdo */}
            <div className="pt-[var(--size-header)]">{children}</div>

            <Footer />
          </ThemeProvider>
        </Providers>
      </body>
    </html>
  );
}
