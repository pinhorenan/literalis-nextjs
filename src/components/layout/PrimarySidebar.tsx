// File: src/components/layout/PrimarySidebar.tsx
'use client';

import { useSession } from 'next-auth/react';
import { 
  Home, 
  User, 
  BookOpen,
  BookPlus,
  PlusSquare,
  Search, 
  MessageSquare, 
  Bell, 
  LogIn, 
} from 'lucide-react';
import { useState }           from 'react';
import { Button, LogoButton } from '@components/ui/Buttons';
import LogoutMenu             from '@components/ui/LogoutMenu';
import SidebarShell           from '@components/layout/SidebarShell';
import NewPostModal           from '@components/post/NewPostModal';

interface NavItem {
  label: string;
  icon: React.ElementType;
  href?: string;
  onClick?: () => void;
}

export default function PrimarySidebar() {
  const { data: session } = useSession();
  const [modalOpen, setModalOpen] = useState(false);
  const username = session?.user?.username;
  
  const nav: NavItem[] = [
    { label: 'Início', icon: Home, href: '/feed' },
    ...(username
      ? [
          { label: 'Perfil',        icon: User,           href: `/profile/${username}`            },
          { label: 'Estante',       icon: BookOpen,       href: `/profile/${username}/bookshelf`  },
          { label: 'Buscar',        icon: Search,         href: '/search'                         },
          { label: 'Mensagens',     icon: MessageSquare,  href: '/feed'                           },
          { label: 'Notificações',  icon: Bell,           href: '/feed'                           },
          { label: 'Publicar',      icon: BookPlus,       onClick: () => setModalOpen(true),      },    
        ]
      : [ { label: 'Entrar',        icon: LogIn,          href: '/signin'                         }]),
  ];

  return (
    <SidebarShell position="left">
      <div className="flex flex-col h-full">
        <LogoButton />

        <nav className="flex flex-col items-start gap-1 mt-2">
          {nav.map(({ label, icon: Icon, href, onClick }) => (
            <Button
              key={label}
              href={onClick? undefined : href}
              onClick={onClick}
              iconSize={30}
              variant="default"
              className="bg-transparent hover:bg-[var(--surface-card-hover)] gap-3 rounded-lg border-none"
            >
              <Icon icon={Icon}/><strong className="text-lg text-[var(--text-secondary)]">{label}</strong>
            </Button>
          ))}
        </nav>
        {modalOpen && <NewPostModal open={modalOpen} onClose={() => setModalOpen(false)} />}
          
        {/* Colocoar condicional para estar logado */}
        <LogoutMenu /> 
      </div>
    </SidebarShell>
  );
}
