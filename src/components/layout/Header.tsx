// components/layout/Header.tsx
'use client';

import clsx                       from 'clsx';
import { useState }               from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useSession, signOut }    from 'next-auth/react';
import { MessageSquare, Bell }    from 'lucide-react';
import { Button, ThemeToggle }    from '@components/ui/Buttons';
import { SearchBar }              from '@components/ui/SearchBar';
import ProfileMenu                from '@components/ui/ProfileMenu';

type HeaderVariant = 'landing' | 'feed' | 'profile' | 'unauthenticated';

interface HeaderProps {
  variant?: HeaderVariant;
  translucent?: boolean;
}

export default function Header({
  variant = 'feed',
  translucent = false,
}: HeaderProps) {
  const { data: session, status } = useSession();
  const loggedIn = status === 'authenticated';
  const router = useRouter();
  const pathname = usePathname();
  const [q, setQ] = useState('');

  const onSearch = () => {
    const term = q.trim();
    if (term) router.push(`/search?q=${encodeURIComponent(term)}`);
  };

  const baseClasses = clsx(
    'fixed top-0 z-50 w-screen border-b',
    translucent
      ? 'backdrop-blur-sm bg-[var(--surface-alt)/60] dark:bg-[var(--surface-alt)/60]'
      : 'bg-[var(--surface-alt)] dark:bg-[var(--surface-alt)]',
    'border-[var(--border-base)]'
  );

  const logo = (
    <Button
      variant="logo"
      logoSrc="/assets/icons/logo_small.svg"
      logoSize={40}
      href="/"
    />
  );

  // -------------------------
  // 1) Landing (não autenticado)
  // -------------------------
  const LandingNav = () => (
    <nav className="flex items-center gap-6">
      <Button variant="default" onClick={() => router.push('/about')}>
        Sobre
      </Button>
      <Button variant="default" onClick={() => router.push('/login')}>
        Entrar
      </Button>
      <Button variant="default" onClick={() => router.push('/register')}>
        Criar conta
      </Button>
      <ThemeToggle />
    </nav>
  );

  // -------------------------
  // 2) Feed (usuário autenticado)
  // -------------------------
  const FeedNav = () => (
    <div className="flex items-center gap-4">
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
    <header className={baseClasses} style={{ height: 'var(--size-header)' }}>
      <div className="container mx-auto flex items-center justify-between px-4 h-full">
        {logo}

        {variant === 'landing' && !loggedIn && <LandingNav />}

        {variant === 'feed' && loggedIn && <FeedHeaderContent />}

        {variant === 'profile' && loggedIn && <ProfileHeaderContent />}

        {variant === 'unauthenticated' && !loggedIn && <LandingNav />}
      </div>
    </header>
  );
}
