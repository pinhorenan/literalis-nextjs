// File: src/app/layout.tsx

import type { Metadata }    from  'next';
import { getServerSession } from  'next-auth';
import { authOptions }      from  '@server/auth';

import '@styles/globals.css';

import Providers            from  '@app/providers';
import ThemeProvider        from  '@app/theme-provider';

export const metadata: Metadata = {
  title: 'Literalis',
  description: 'Rede social literária',
  icons: {
    icon: '/icons/favicon.svg',
    shortcut: '/favicon.svg',
  },
};

export default async function RootLayout({ 
  children, 
}: { 
  children: React.ReactNode }
) {
  const session = await getServerSession(authOptions);

  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <body 
        className="
          min-h-screen min-w-screen 
          font-sans antialiased 
          selection:bg-[var(--surface-base)] selection:text-[var(--text-primary)]
        "
      >
        <Providers session={session}>
          <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
            <div className="bg-[var(--surface-bg) min-h-screen overflow-x-hidden">
              {children}
            </div>
          </ThemeProvider>
        </Providers>
      </body>
    </html>
  );
}
