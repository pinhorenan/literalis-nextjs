'use client';

import { useSession, signOut } from 'next-auth/react';
import {
  Home,
  User,
  BookOpen,
  BookPlus,
  Search,
  MessageSquare,
  Bell,
  LogOut,
  Moon,
  Sun,
} from 'lucide-react';
import { useState, useEffect } from 'react';
import { useTheme } from 'next-themes';

import { Button }   from            '@components/ui/Buttons';
import { Logo }     from            '@components/svg/Logo';
import SidebarShell from            '@components/layout/SidebarShell';
import NewPostModal from            '@components/post/NewPostModal';

export default function PrimarySidebar() {
  const { data: session } = useSession();
  const [modalOpen, setModalOpen] = useState(false);
  const username = session?.user?.username ?? '';

  // itens do topo
  const navItems = [
    { label: 'Início',      icon: Home,            href: '/feed' },
    { label: 'Perfil',      icon: User,            href: `/profile/${username}` },
    { label: 'Estante',     icon: BookOpen,        href: `/profile/${username}/bookshelf` },
    { label: 'Buscar',      icon: Search,          href: '/search' },
    { label: 'Mensagens',   icon: MessageSquare,   href: '/feed' },
    { label: 'Notificações',icon: Bell,            href: '/feed' },
    { label: 'Publicar',    icon: BookPlus,        onClick: () => setModalOpen(true) },
  ];

  // tema
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  const isDark = resolvedTheme === 'dark';
  const toggleTheme = () => setTheme(isDark ? 'light' : 'dark');

  // classes comuns
  const buttonClass =
    'bg-transparent hover:bg-[var(--surface-card-hover)] gap-3 rounded-lg border-none text-[var(--text-secondary)] text-base';


  // itens de baixo
  const bottomItems = [
    {
      label: isDark ? 'Tema claro' : 'Tema escuro',
      icon: isDark ? Sun : Moon,
      onClick: toggleTheme,
      show: mounted,
    },
    {
      label: 'Sair',
      icon: LogOut,
      onClick: () => signOut({ callbackUrl: '/' }),
    },
  ];

  return (
    <SidebarShell position="left">
      <div className="flex flex-col justify-between h-full py-2">
        <div>

          <div className="flex items-center gap-2 px-4">
            <Logo />
            <strong className="text-[var(--text-primary)]">Literalis</strong>
          </div>
          <nav className="flex flex-col items-start gap-1 mt-2">
            {navItems.map(({ label, icon: Icon, href, onClick }) => (
              <Button
                key={label}
                href={onClick ? undefined : href}
                onClick={onClick}
                variant="default"
                className={buttonClass}
              >
                <Icon size={30} />
                <strong>{label}</strong>
              </Button>
            ))}
          </nav>
        </div>

        {/* rodapé */}
        <div className="flex flex-col items-start gap-1 ">
          {bottomItems.map(({ label, icon: Icon, onClick, show }) => {
            if (show === false) return null;
            return (
              <Button
                key={label}
                onClick={onClick}
                variant="default"
                className={buttonClass}
              >
                <Icon size={30} />
                <strong>{label}</strong>
              </Button>
            );
          })}
        </div>

        {/* modal de criar post */}
        {modalOpen && <NewPostModal open={modalOpen} onClose={() => setModalOpen(false)} />}
      </div>
    </SidebarShell>
  );
}
