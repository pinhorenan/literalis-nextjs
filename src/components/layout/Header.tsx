// components/layout/Header.tsx
'use client';

import clsx                       from 'clsx';
import { useState }               from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useSession, signOut }    from 'next-auth/react';
import { useTheme }               from 'next-themes';
import { MessageSquare, Bell }    from 'lucide-react';
import { Button, ThemeToggle }    from '@components/ui/Buttons';
import { SearchBar }              from '@components/ui/SearchBar';
import ProfileMenu                from '@components/ui/ProfileMenu';

type HeaderVariant = 'landing' | 'feed' | 'profile' | 'unauthenticated';

interface HeaderProps {
  variant?: HeaderVariant;
}

export default function Header({
  variant = 'feed',
}: HeaderProps) {
  const { theme, systemTheme, setTheme } = useTheme();
  const { data: session, status } = useSession();
  const loggedIn = status === 'authenticated';
  const router = useRouter();
  const pathname = usePathname();
  const [q, setQ] = useState('');

    // enquanto o tema não estiver definido no client, evita hydratation mismatch
  const mounted = typeof window !== 'undefined';
  const currentTheme = theme === 'system' ? systemTheme : theme;

  if (!mounted) {
    return null; // ou um loading skeleton
  }


  const onSearch = () => {
    const term = q.trim();
    if (term) router.push(`/search?q=${encodeURIComponent(term)}`);
  };

  const baseClasses = clsx(
    'fixed top-0 z-50 w-screen',
    'border-b border-[var(--border-base)]',
    'bg-[var(--surface-alt)]'
  );

  const logo = ( <Button variant="logo" logoSrc={currentTheme === 'dark' ? "/assets/icons/dark/logo_small.svg" : "/assets/icons/light/logo_small.svg"} logoSize={40} href="/" /> );

  // -------------------------
  // 1) Landing (não autenticado)
  // -------------------------
  const LandingNav = () => (
    <nav className="flex items-center gap-6 border border-red-500">
      <Button variant="default" onClick={() => router.push('/about')}>
        Sobre
      </Button>
      <Button variant="default" onClick={() => router.push('/auth/login')}>
        Entrar
      </Button>
      <Button variant="default" onClick={() => router.push('/auth/register')}>
        Criar conta
      </Button>
      <ThemeToggle />
    </nav>
  );

  // -------------------------
  // 2) Feed (usuário autenticado)
  // -------------------------
  const FeedNav = () => (
    <div className="flex items-center gap-4 mx-[var(--size-sidebar)] border border-red-500">
      <ThemeToggle />
      <Button
        variant="icon"
        icon={MessageSquare}
        aria-label="Mensagens"
        onClick={() => router.push('/messages')}
      />
      <Button
        variant="icon"
        icon={Bell}
        aria-label="Notificações"
        onClick={() => router.push('/notifications')}
      />
      <ProfileMenu
        avatarSrc={session?.user?.image ?? '/assets/images/users/default.jpg'}
        userName={session?.user?.name ?? session?.user?.email ?? 'Usuário'}
        onLogout={() => signOut({ callbackUrl: '/' })}
      />
    </div>
  );

  // -------------------------
  // 3) Search + Feed header completo
  // -------------------------
  const FeedHeaderContent = () => (
    <>
      <SearchBar value={q} onChange={setQ} onSearch={onSearch} />
      <FeedNav />
    </>
  );

  // -------------------------
  // 4) Profile (página de usuário)
  //    — pode reutilizar FeedNav, trocar título, breadcrumbs…
  // -------------------------
  const ProfileHeaderContent = () => (
    <>
      {/* Exemplo de breadcrumb / título */}
      <div className="flex-1">
        <h2 className="text-lg font-semibold">
          {/** poderia receber username como prop, etc */}
          Meu perfil
        </h2>
      </div>
      <FeedNav />
    </>
  );

  return (
    <header className={baseClasses} style={{ height: 'var(--size-header' }}>
      <div className="container mx-[var(--size-sidebar)] flex items-center justify-between h-full">
        {logo}

        {variant === 'landing' && !loggedIn && <LandingNav />}

        {variant === 'feed' && loggedIn && <FeedHeaderContent />}

        {variant === 'profile' && loggedIn && <ProfileHeaderContent />}

        {variant === 'unauthenticated' && !loggedIn && <LandingNav />}
      </div>
    </header>
  );
}
