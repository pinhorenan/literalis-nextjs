'use client';

import { useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import clsx from 'clsx';
import { useSession, signOut } from 'next-auth/react';

import ProfileMenu from '@/src/components/navigation/ProfileMenu';
import { Button, ThemeToggle } from '@/src/components/ui/Buttons';
import { SearchBar } from '@/src/components/search/SearchBar';
import { MessageSquare, Bell } from 'lucide-react';

export default function Header({ translucent = false }: { translucent?: boolean }) {
  const { data: session, status } = useSession();
  const loggedIn = status === 'authenticated';
  
  const pathname = usePathname();
  const router = useRouter();
  const isLanding = pathname === '/';

  const [q, setQ] = useState('');
  const search = () => q.trim() && router.push(`/search?q=${encodeURIComponent(q)}`);

  const base = clsx(
    'sticky top-0 z-50 border-b border-[var(--border-base)]',
    translucent
      ? 'backdrop-blur-sm bg-[var(--surface-alt)/60] dark:bg-[var(--surface-alt)/60]]'
      : 'bg-[var(--surface-alt)] dark:bg-[var(--surface-alt)]',
  );

  return (
    <header className={base}>
      <div className="container mx-auto flex items-center justify-between px-4 h-[var(--size-header)]">
        <Button variant="logo" logoSrc="/assets/icons/logo_small.svg" logoSize={40} href="/" />

        {/* Landing page */}
        {isLanding && !loggedIn && (
          <nav className="flex items-center gap-6">
            <Button variant="default" onClick={() => router.push('/about')}>Sobre</Button>
            <Button variant="default" onClick={() => router.push('/login')}>Entrar</Button>
            <ThemeToggle />
          </nav>
        )}

        {/* Usuário autenticado (Em qualquer rota) */}
        {loggedIn && (
          <>
            <SearchBar value={q} onChange={setQ} onSearch={search} />

            <div className="flex items-center gap-4">
              <ThemeToggle />
              <Button variant="icon" icon={MessageSquare} aria-label="Mensagens" onClick={() => router.push('/messages')} />
              <Button variant="icon" icon={Bell} aria-label="Notificações" onClick={() => router.push('/notifications')} />
            
              {/* Avatar + menu */}
              <ProfileMenu
                avatarSrc={session.user?.image ?? '/assets/images/users/default.jpg'}
                userName={session.user?.name ?? session.user?.email ?? 'Usuário'}
                onLogout={() => signOut({ callbackUrl: '/' })}
              />
            </div>
          </>
        )

        }

      </div>
    </header>
  ) 


}