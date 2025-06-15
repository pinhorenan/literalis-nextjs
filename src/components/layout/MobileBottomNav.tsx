// File: src/components/layout/MobileBottomNav.tsx
'use client';

import { useState } from 'react';
import { Home, Search, User, BookOpen, BookPlus } from 'lucide-react';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import NewPostModal from '@components/post/NewPostModal';

interface NavItem {
  icon: React.ElementType;
  label: string;
  href?: string;
  onClick?: () => void;
}

export default function MobileBottomNav() {
  const { data: session } = useSession();
  const username = session?.user?.username;
  const [modalOpen, setModalOpen] = useState(false);

  const navItems: NavItem[] = [
    { icon: Home,     href: '/feed',                            label: 'Início'     },
    { icon: Search,   href: '/search',                          label: 'Buscar'     },
    { icon: BookPlus, onClick: () => setModalOpen(true),        label: 'Publicar'   },
    { icon: BookOpen, href: `/profile/me/bookshelf`,            label: 'Estante'    },
    { icon: User,     href: `/profile/me`,                      label: 'Perfil'     },
  ];

  return (
    <>
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-[var(--surface-bg)] border-t border-[var(--border-base)] flex justify-around py-2">
        {navItems.map(({ icon: Icon, href, onClick, label }) => {
          if (onClick) {
            return (
              <button
                key={label}
                onClick={onClick}
                className="flex flex-col items-center text-sm text-[var(--text-secondary)]"
              >
                <Icon size={24} />
                <span className="text-xs mt-1">{label}</span>
              </button>
            );
          }

          return (
            <Link
              key={label}
              href={href || '#'}
              className="flex flex-col items-center text-sm text-[var(--text-secondary)]"
            >
              <Icon size={24} />
              <span className="text-xs mt-1">{label}</span>
            </Link>
          );
        })}
      </nav>

      {modalOpen && <NewPostModal open={modalOpen} onClose={() => setModalOpen(false)} />}
    </>
  );
}
