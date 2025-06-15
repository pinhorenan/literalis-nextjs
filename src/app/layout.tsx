// File: src/app/layout.tsx

import { type Metadata    } from  'next';
import { ReactNode        } from  'react';
import { getServerSession } from  'next-auth';
import { authOptions      } from  '@server/auth';
import ThemeProvider        from  '@app/theme-provider';
import Providers            from  '@app/providers';

import '@styles/globals.css';

export const metadata: Metadata = {
  title: 'Literalis',
  description: 'Rede social literária',
  icons: {
    icon: '/assets/icons/favicon.svg',
    shortcut: '/assets/favicon.svg',
  },
};

export default async function RootLayout({ children }: { children: ReactNode }) {
  const session = await getServerSession(authOptions);

  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <body className="min-h-screen min-w-screen font-sans antialiased">
        <Providers session={session}>
          <ThemeProvider attribute="class" defaultTheme="sytem">
              <main className="flex-1">
                {children}
              </main>
          </ThemeProvider>
        </Providers>
      </body>
    </html>
  );
}
