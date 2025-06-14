// File: src/components/sidebar/PrimarySidebar.tsx
'use client';

import { useSession } from 'next-auth/react';
import { User, Users, Globe, BookOpen, Search, MessageSquare, Bell, LogIn, Home } from 'lucide-react';

import { SidebarShell } from '@/src/components/layout/SidebarShell';
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
          { label: 'Início',        icon: Home,           href: '/feed' },
          { label: 'Pesquisar',     icon: Search,         href: '/search' },
        ...(username
        ? [ 
          { label: 'Perfil',        icon: User,           href: `/profile/${username}`        },
          { label: 'Estante',       icon: BookOpen,       href: `/profile/${username}/shelf/` },
          { label: 'Amigos',        icon: Users,          href: '/friends'                    },
          { label: 'Mensagens',     icon: MessageSquare,  href: '/message'                    },
          { label: 'Notificações',  icon: Bell,           href: '/notifications'              },
          ]
        : [ 
          { label: 'Entrar',        icon: LogIn,          href: '/signin'                      } 
          ]
        ),
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
          
        
        {/* Colocoar condicional para estar logado */}
        <LogoutMenu /> 
      </div>
    </SidebarShell>
  );
}
