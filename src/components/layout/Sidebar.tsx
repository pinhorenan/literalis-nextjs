'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import clsx from 'clsx';
import { useSession } from 'next-auth/react';

import { Button } from '@/src/components/ui/Buttons';
import { User, Globe, BookOpen, ChevronLeft, ChevronRight, Settings, Users } from 'lucide-react';
import type { Book } from '@prisma/client';

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
  const userName = session?.user?.name ?? session?.user?.email ?? 'Visitante';

  /* ───────── Navegação principal ───────── */
  const mainNav = [
    { label: 'Perfil',         icon: User,      href: '/profile' },
    { label: 'Estante',        icon: BookOpen,  href: '/shelf' },
    { label: 'Explorar',       icon: Globe,     href: '/' },
    { label: 'Amigos',         icon: Users,     href: '/friends' },
    { label: 'Configurações',  icon: Settings,  href: '/preferences' },
  ];

  /* ───────── Recomendados (quando variant==='recommended') ───────── */
  const [books, setBooks] = useState<Book[]>([]);
  const [load,  setLoad]  = useState(false);

  useEffect(() => {
    if (props.variant === 'recommended') {
      setLoad(true);
      fetch('/api/books')
        .then(r => r.json())
        .then(setBooks)
        .finally(() => setLoad(false));
    }
  }, [props.variant]);

  /* ───────── Colapso da sidebar ───────── */
  const [collapsed, setCollapsed] = useState(false);
  const isMain = props.variant === 'main';

  const asideCls = clsx(
    'sticky top-[var(--size-header)] flex-shrink-0 transition-transform duration-300',
    'h-[calc(100vh_-_var(--size-header))] w-max-[var(--size-sidebar)]',
    'shadow-md overflow-auto p-4 space-y-6',
    'bg-[var(--surface-alt)] border-[var(--border-base)]',
    isMain ? 'border-r' : 'border-l',
    collapsed ? (isMain ? '-translate-x-full' : 'translate-x-full') : '',
  );

  const Arrow = collapsed
    ? (isMain ? ChevronRight : ChevronLeft)
    : (isMain ? ChevronLeft : ChevronRight);

  return (
    <aside className={asideCls}>
      {/* Botão de colapso */}
      <div className={clsx('absolute top-2', isMain ? 'right-2' : 'left-2')}>
        <Button
          variant="icon"
          icon={Arrow}
          onClick={() => setCollapsed(!collapsed)}
          className="hover:bg-[var(--surface-card)] transition rounded-full"
        />
      </div>

      {/* -------- Sidebar principal -------- */}
      {isMain && (
        <>
          {!collapsed && (
            <h2 className="text-xl font-semibold text-[var(--text-primary)] mb-4">
              Olá, {userName.split(' ')[0]}!
            </h2>
          )}

          <nav className="flex flex-col gap-3">
            {mainNav.map(({ label, icon: Icon, href }) => (
              <Link key={label} href={href} className="justify-end flex">
                <Button
                  variant="default"
                  className=" border-0 bg-transparent hover:bg-[var(--surface-card-hover)] gap-2 transition rounded-lg"
                >
                  {!collapsed && label}
                  <Icon size={24} />
                </Button>
              </Link>
            ))}
          </nav>

          {/* Progresso recente do livro */}
          { !collapsed && (
            <section className="mt-6 space-y-3">
              <h3 className="text-sm font-medium text-[var(--text-secondary)]">
                Progresso Recente
              </h3>

          {props.recentBookCover && (
              <img
                src={props.recentBookCover}
                alt="Capa do livro"
                className="w-full rounded-lg border border-[var(--border-subtle)]"
              />
          )}

              {props.recentBookPagesRead != null && props.recentBookTotalPages && (
                <>
                  <div className="w-full h-2 rounded-full bg-[var(--surface-card)] overflow-hidden">
                    <div
                      className="h-full bg-[var(--color-primary)] transition-width duration-500"
                      style={{
                        width: `${(props.recentBookPagesRead / props.recentBookTotalPages) * 100}%`,
                      }}
                    />
                  </div>
                  <p className="text-xs text-[var(--text-tertiary)]">
                    {props.recentBookPagesRead}/{props.recentBookTotalPages} páginas
                  </p>
                </>
              )}

              <Button
                variant="default"
                size="sm"
                className="w-full justify-center hover:bg-[var(--surface-card)] transition rounded-lg"
                onClick={props.onNewBook}
              >
                <BookOpen size={16} /> {!collapsed && 'Novo Livro'}
              </Button>
            </section>
          )}
        </>
      )}

      {/* -------- Sidebar de recomendados -------- */}
      {props.variant === 'recommended' && (
        <>
          {!collapsed && (
            <h2 className="text-xl font-semibold text-[var(--text-primary)] mb-4">
              Recomendados
            </h2>
          )}

          {load && <p className="text-sm">Carregando...</p>}
          {!load && !books.length && (
            <p className="text-sm text-[var(--text-tertiary)]">
              Nenhum livro recomendado no momento.
            </p>
          )}

          <ul className="space-y-3">
            {books.map(book => (
              <li key={book.isbn} className="group hover:bg-[var(--surface-card)] transition rounded-lg p-1">
                <Link href={`/book/${book.isbn}`} className="flex items-center gap-3">
                  <img
                    src={book.coverPath}
                    alt={book.title}
                    className="w-10 h-14 object-cover rounded"
                  />
                  {!collapsed && (
                    <span className="text-sm group-hover:underline">{book.title}</span>
                  )}
                </Link>
              </li>
            ))}
          </ul>
        </>
      )}
    </aside>
  );
}
