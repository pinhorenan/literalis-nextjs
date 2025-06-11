// components/layout/Sidebar.tsx
'use client';

import { User, Globe, BookOpen, Settings, Users, MessageSquare, Bell, Plus } from 'lucide-react';
import { useEffect, useState, ReactNode }               from 'react';
import { useSession }                                   from 'next-auth/react';
import { Button }                                       from '@components/ui/Buttons';

import type { Book, User as PrismaUser } from '@prisma/client';

import Image  from 'next/image';
import Link   from 'next/link';
import clsx   from 'clsx';


interface SidebarShellProps {
  isMain: boolean;
  children: ReactNode;
}
function SidebarShell({ isMain, children }: SidebarShellProps) {
  return (
    <aside className="relative flex-shrink-0 w-[var(--size-sidebar)]">
      <div
        className={clsx(
          'fixed top-0',
          isMain ? 'left-0' : 'right-0',
          'w-[var(--size-sidebar)] h-full',
          'overflow-auto p-4 space-y-2 bg-[var(--surface-bg)]',
          'border-[var(--border-base)]',
          isMain ? 'border-r' : 'border-none bg-transparent mr-30 overflow-y-hidden',
        )}
      >
        {children}
      </div>
    </aside>
  );
}

export interface MainSidebarProps {
}
export function MainSidebar(_props: MainSidebarProps) {
  const { data: session } = useSession();
  const me = session?.user;
  const userName = me?.name ?? me?.email ?? 'Visitante';
  const firstName = userName.split(' ')[0];

  const mainNav = [
    { label: 'Perfil', icon: User, href: '/profile' },
    { label: 'Amigos', icon: Users, href: '/friends' },
    { label: 'Explorar', icon: Globe, href: '/feed' },
    { label: 'Estante', icon: BookOpen, href: '/shelf' },
    { label: 'Mensagens', icon: MessageSquare, href: '/messages'},
    { label: 'Notificações', icon: Bell, href: '/notifications'},
  ] as const;



  return (
    <SidebarShell isMain>
      <div className="flex flex-col h-full">
        <Button
          variant="logo"
          logoSrc="/assets/icons/main_logo.svg"
          logoSize={140}
          logoAlt="Logo do site"
          className="mb-2 self-start"
          href="/"
          aria-label="Logo do site"
        />

        <nav className="flex flex-col gap-1">
          {mainNav.map(({ label, icon: Icon, href }) => (
            <Link key={label} href={href} className="flex justify-start">
              <Button
                variant="default"
                className="bg-transparent hover:bg-[var(--surface-card-hover)] gap-3 rounded-lg border-none"
                aria-label={label}
              >
                <Icon size={30} className="text-[var(--text-secondary)]"/>
                <strong className="text-lg text-[var(--text-secondary)]">{label}</strong>
              </Button>
            </Link>
          ))}
        </nav>
        <Button
          variant="default"
          className="bg-transparent hover:bg-[var(--surface-card-hover)] gap-3 rounded-lg border-none mt-auto self-start"
          onClick={() => alert(`Olá, ${firstName}!`)}
          >
            <Settings size={30} className="text-[var(--text-secondary)]"/> 
            <strong className="text-lg text-[var(--text-secondary)]">Preferências</strong>
        </Button> 
      </div>
    </SidebarShell>
  );
}

export interface RecommendedSidebarProps {
  onNewBook?: () => void;
  recentBookCover?: string;
  recentBookPagesRead?: number;
  recentBookTotalPages?: number;
}
export function RecommendedSidebar({
  onNewBook,
  recentBookCover,
  recentBookPagesRead,
  recentBookTotalPages,
}: RecommendedSidebarProps) {
  const { data: session } = useSession();
  const me = session?.user;
  const userName = me?.name ?? me?.email ?? 'Visitante';

  const [books, setBooks] = useState<Book[]>([]);
  const [people, setPeople] = useState<PrismaUser[]>([]);
  const [loadingBooks, setLoadingBooks] = useState(false);
  const [loadingPeople, setLoadingPeople] = useState(false);
  
  const hasProgress =
    typeof recentBookPagesRead === 'number' &&
    typeof recentBookTotalPages === 'number';
  const progress = hasProgress
    ? (recentBookPagesRead! / recentBookTotalPages!) * 100
    : 0;

  useEffect(() => {
    setLoadingPeople(true);
    fetch('/api/users?limit=5')
      .then((r) => r.json())
      .then((data) => setPeople(data.slice(0, 4)))
      .finally(() => setLoadingPeople(false));

    setLoadingBooks(true);
    fetch('/api/books?limit=5')
      .then((r) => r.json())
      .then((data) => setBooks(data.slice(0, 2)))
      .finally(() => setLoadingBooks(false));
  }, []);

  return (
    <SidebarShell isMain={false}>
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
            <p className="text-xs text-[var(--text-tertiary)]">{me.email}</p>
          )}
        </div>
      </div>

      <hr className="border-[var(--border-subtle)]" />

      {/* perfis recomendados */}    
      <h3 className="text-sm font-semibold text-[var(--text-secondary)] mb-2">
        Perfis recomendados
      </h3>
      {loadingPeople && <p className="text-sm">Carregando…</p>}
      <ul className="space-y-3">
        {people.map((p) => (
          <li key={p.id} className="group">
            <Link
              href={`/profile/${p.username}`}
              className="flex items-center gap-2"
            >
              <Image
                src={p.avatarPath || '/assets/images/users/default.jpg'}
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

      <hr className="border-[var(--border-subtle)]" />

      {/* Leitura Recente */}
      <section className="mt-2 space-y-2 px-2">
        <h3 className="text-sm font-medium text-[var(--text-secondary)]">
          Leitura recente:
        </h3>

        {recentBookCover && (
          <div className="relative w-full h-48 rounded-lg border border-[var(--border-subtle)] overflow-hidden">
            <Image
              src={recentBookCover}
              alt="Capa do livro"
              fill
              className="object-cover"
            />
          </div> 
        )}

        {!recentBookCover && (
          <div className="relative w-full h-80 px-4">
            <Image
              src="/assets/images/books/1984.jpg"
              alt="Capa do livro"
              fill
              className="object-cover rounded-lg border border-[var(--border-base)]"
            />
          </div>
        )}

        {hasProgress && (
          <>
            <div className="w-full h-2 rounded-full bg-[var(--surface-card)] overflow-hidden">
              <div
                className="h-full bg-[var(--color-primary)]"
                style={{ width: `${progress}%` }}
              />
            </div>
            <p className="text-xs text-[var(--text-tertiary)]">
              {recentBookPagesRead}/{recentBookTotalPages} páginas
            </p>
          </>
        )}

        <Button
          variant="default"
          size="sm"
          className="w-full gap-2 justify-center hover:bg-[var(--surface-card-hover)] border-none rounded-lg"
          onClick={onNewBook}
        >
          <BookOpen size={20} /> <span>Novo Livro</span>
        </Button>
      </section>       
    </SidebarShell>
  );
}