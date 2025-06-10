// app/layout.tsx
import React                from  'react';
import type { Metadata }    from  'next';
import { getServerSession } from  'next-auth';
import { authOptions }      from  '@server/auth';

import Header               from  '@components/layout/Header';
import ThemeProvider        from  '@app/theme-provider';
import Providers            from  '@app/providers';

import '@styles/globals.css';

export const metadata: Metadata = {
  title: 'Literalis',
  description: 'Rede social literária',
  icons: {
    icon: '/favicon.svg',
    shortcut: '/favicon.svg',
  },
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const session = await getServerSession(authOptions);

  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <body className="min-h-screen min-w-screen font-sans antialiased bg-[var(--surface-base)] text-[var(--text-primary)]">
        <Providers session={session}>
          <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
            {/* <Header variant={session ? 'feed' : 'landing'} /> */}
            <div className="bg-[var(--surface-bg)">
              {children}
            </div>
          </ThemeProvider>
        </Providers>
      </body>
    </html>
  );
}
