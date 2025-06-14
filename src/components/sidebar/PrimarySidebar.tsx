// File: src/components/sidebar/PrimarySidebar.tsx
'use client';

import { useSession } from 'next-auth/react';
import { User, Users, Globe, BookOpen, Search, MessageSquare, Bell } from 'lucide-react';

import { SidebarShell } from '@components/sidebar/SidebarShell';
import { LogoutMenu } from '@components/ui/LogoutMenu';
import { Button, LogoButton } from '@components/ui/Buttons';

interface NavItem {
  label: string;
  icon: React.ElementType;
  href: string;
}

export default function PrimarySidebar() {
  const { data: session } = useSession();
  const username = session?.user?.username;

  const nav: NavItem[] = [
    ...(username
      // todo: adicionar aqui um item de home que redireciona para o feed e fica no topo.
      ? [{ label: 'Perfil', icon: User, href: `/profile/${username}` }]
      : []),
    { label: 'Amigos', icon: Users, href: '/friends' }, // todo: implementar página amigos
    { label: 'Explorar', icon: Globe, href: '/feed' },
    ...(username
      ? [{ label: 'Estante', icon: BookOpen, href: `/profile/${username}/shelf/` }]
      : []),
    { label: 'Pesquisar', icon: Search, href: '/search' }, // todo: implementar pesquisa
    { label: 'Notificações', icon: Bell, href: '/notifications' }, // todo: implementar notificações
    { label: 'Mensagens', icon: MessageSquare, href: '/message' }, // todo: implementar mensagens
    // todo: adicionar item de novo livro ou algo similar (novo post?)
  ];

  return (
    <SidebarShell position="left">
      <div className="flex flex-col h-full">
        <LogoButton />

        <nav className="flex flex-col items-start gap-1 mt-2">
          {nav.map(({ label, icon: Icon, href }) => (
            <Button
              key={label}
              href={href}
              iconSize={30}
              variant="default"
              className="bg-transparent hover:bg-[var(--surface-card-hover)] gap-3 rounded-lg border-none"
            >
              <Icon icon={Icon}/><strong className="text-lg text-[var(--text-secondary)]">{label}</strong>
            </Button>
          ))}
        </nav>

        <LogoutMenu />
      </div>
    </SidebarShell>
  );
}
