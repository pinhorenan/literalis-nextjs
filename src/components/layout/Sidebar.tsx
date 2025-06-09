// src/components/layout/Sidebar.tsx
'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import clsx from 'clsx';
import { useSession } from 'next-auth/react';

import { Button } from '@/src/components/ui/Buttons';
import {
  User,
  Globe,
  BookOpen,
  ChevronLeft,
  ChevronRight,
  Settings,
  Users,
  Plus,
} from 'lucide-react';
import type { Book, User as PrismaUser } from '@prisma/client';

interface Props {
  variant: 'main' | 'recommended';
  onTabChange?: (tab: string) => void;
  onNewBook?: () => void;
  recentBookCover?: string;
  recentBookPagesRead?: number;
  recentBookTotalPages?: number;
}

export default function Sidebar(props: Props) {
  const { data: session } = useSession();
  const me = session?.user;
  const userName = me?.name ?? me?.email ?? 'Visitante';

  /* ───────── Navegação principal ───────── */
  const mainNav = [
    { label: 'Perfil',        icon: User,     href: '/profile' },
    { label: 'Estante',       icon: BookOpen, href: '/shelf' },
    { label: 'Explorar',      icon: Globe,    href: '/' },
    { label: 'Amigos',        icon: Users,    href: '/friends' },
    { label: 'Configurações', icon: Settings, href: '/preferences' },
  ];

  /* ───────── Recomendados ───────── */
  const [books, setBooks] = useState<Book[]>([]);
  const [people, setPeople] = useState<PrismaUser[]>([]);
  const [loadingBooks, setLoadingBooks] = useState(false);
  const [loadingPeople, setLoadingPeople] = useState(false);

  useEffect(() => {
    if (props.variant !== 'recommended') return;

    setLoadingPeople(true);
    fetch('/api/users?limit=5')
      .then(r => r.json())
      .then(setPeople)
      .finally(() => setLoadingPeople(false));

    setLoadingBooks(true);
    fetch('/api/books?limit=5')
      .then(r => r.json())
      .then(setBooks)
      .finally(() => setLoadingBooks(false));
  }, [props.variant]);

  /* ───────── Colapso ───────── */
  const [collapsed, setCollapsed] = useState(false);
  const isMain = props.variant === 'main';

  const asideCls = clsx(
    'sticky top-[var(--size-header)] flex-shrink-0 transition-transform duration-300',
    'h-[calc(100vh_-_var(--size-header))] w-64',          // força mesma largura
    'shadow-md overflow-auto p-4 space-y-6',
    'bg-[var(--surface-alt)] border-[var(--border-base)]',
    isMain ? 'border-r' : 'border-l',
    collapsed ? (isMain ? '-translate-x-full' : 'translate-x-full') : '',
  );

  const Arrow = collapsed
    ? isMain ? ChevronRight : ChevronLeft
    : isMain ? ChevronLeft : ChevronRight;

  return (
    <aside className={asideCls}>
      {/* Colapse toggle */}
      <div className={clsx('absolute top-2', isMain ? 'right-2' : 'left-2')}>
        <Button
          variant="icon"
          size="sm"
          icon={Arrow}
          onClick={() => setCollapsed(!collapsed)}
          className="hover:bg-[var(--surface-card)] rounded-full"
        />
      </div>

      {/* ===== MAIN ===== */}
      {isMain && !collapsed && (
        <>
          <h2 className="text-xl font-semibold mb-4">
            Olá, {userName.split(' ')[0]}!
          </h2>
          <nav className="flex flex-col gap-3">
            {mainNav.map(({ label, icon: Icon, href }) => (
              <Link key={label} href={href} className="flex">
                <Button
                  variant="default"
                  className="bg-transparent hover:bg-[var(--surface-card-hover)] gap-2 rounded-lg"
                >
                  <Icon size={24} />
                  <span>{label}</span>
                </Button>
              </Link>
            ))}
          </nav>
          {/* … restante do bloco MAIN … */}
        </>
      )}

      {/* ===== RECOMMENDED ===== */}
      {props.variant === 'recommended' && (
        <>
          {/* bloco 1: perfil */}
          {!collapsed && (
            <div className="flex items-center gap-3">
              <Image
                src={me?.image ?? '/assets/images/users/default.jpg'}
                alt={userName}
                width={48}
                height={48}
                className="rounded-full border"
              />
              <div>
                <p className="font-medium">{userName}</p>
                {me?.email && (
                  <p className="text-xs text-[var(--text-tertiary)]">
                    {me.email}
                  </p>
                )}
              </div>
            </div>
          )}

          <hr className="border-[var(--border-subtle)]" />

          {/* bloco 2: perfis recomendados */}
          {!collapsed && (
            <>
              <h3 className="text-sm font-semibold text-[var(--text-secondary)] mb-2">
                Perfis recomendados
              </h3>
              {loadingPeople && <p className="text-sm">Carregando…</p>}
              <ul className="space-y-3">
                {people.map(p => (
                  <li key={p.id} className="group">
                    <Link href={`/profile/${p.id}`} className="flex items-center gap-2">
                      <Image
                        src={p.avatarPath || '/assets/avatar_placeholder.svg'}
                        alt={p.name}
                        width={32}
                        height={32}
                        className="rounded-full border"
                      />
                      <span className="text-sm truncate group-hover:underline">
                        {p.name}
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </>
          )}

          <hr className="border-[var(--border-subtle)]" />

          {/* bloco 3: livros recomendados (apenas capa + hover) */}
          {!collapsed && (
            <h3 className="text-sm font-semibold text-[var(--text-secondary)] mb-2">
              Livros recomendados
            </h3>
          )}
          {loadingBooks && <p className="text-sm">Carregando…</p>}
          <ul className="flex flex-col items-center space-y-4">
            {books.map(book => (
              <li key={book.isbn} className="relative group">
                <Image
                  src={book.coverPath}
                  alt={book.title}
                  width={80}
                  height={120}
                  className="
                    rounded object-cover transition-shadow
                    group-hover:shadow-lg
                    max-h-[200px]
                  "
                />
                <Button
                  variant="icon"
                  size="sm"
                  icon={Plus}
                  onClick={() => {
                    /* chamar API para adicionar à estante */
                  }}
                  className="
                    absolute bottom-1 right-1 
                    hidden group-hover:block
                  "
                />
              </li>
            ))}
          </ul>
        </>
      )}
    </aside>
  );
}
