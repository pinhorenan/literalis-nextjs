'use client';
import React from 'react';
import Link from 'next/link';
import { Button } from '@/src/components/ui/Button';
import { LucideIcon, User, Globe, BookOpen } from 'lucide-react';

interface SidebarProps {
  currentUserName?: string;
  isOpen?: boolean;
  onTabChange?: (tab: string) => void;
  onNewBook?: () => void;
  recentBookCover?: string;
  recentBookPagesRead?: number;
  recentBookTotalPages?: number;
}

const Sidebar: React.FC<SidebarProps> = ({
  currentUserName = 'Leitor(a)',
  isOpen = true,
  onTabChange,
  onNewBook,
  recentBookCover = '/assets/images/books/1984.jpg',
  recentBookPagesRead = 346,
  recentBookTotalPages = 983,
}) => {
  const progressPercent = Math.round(
    (recentBookPagesRead / recentBookTotalPages) * 100
  );

  return (
    <aside
      id="sidebar"
      className={`
        fixed top-[var(--header-h)] left-5 z-[50]
        w-[var(--sidebar-w)] h-screen 
        p-[var(--gap-md)] ml-[var(--gap-md)]
        flex flex-col items-center 
        bg-[var(--offwhite)]
        transition-transform duration-300 ease-in-out 
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
      `}
      aria-label="Menu lateral"
    >
      <p className="sr-only">Menu principal</p>

      <div className="text-center leading-[1.1]">
        <h1 className="font-serif text-2xl text-[#222]">
          Oi {' '} 
          <span className="font-bold text-[var(--olive)]">
            {currentUserName}
          </span>
        </h1>
      </div>

      <nav 
        className="flex flex-col items-center w-full py-4 gap-[var(--gap-sm)]" 
        aria-label="Seções">

          {/* Amigos */}
          <Link 
            href="/feed?tab=friends" 
            passHref
            className="w-full"
          >
            <Button
              variant="secondary"
              className="flex items-center w-full gap-2"
              size="md"
              onClick={() => onTabChange?.('friends')}
            >
              <User size={20} />
              <span>Amigos</span>
            </Button>
          </Link>
        
          {/* Comunidade (Discover) */}
          <Link 
            href="/feed?tab=discover" 
            passHref
            className="w-full"
          >
            <Button
              variant="secondary"
              className="flex items-center w-full gap-2"
              size="md"
              onClick={() => onTabChange?.('discover')} 
            >
              <Globe size={20} />
              <span>Comunidade</span>
            </Button>
          </Link>

          {/* Estante */}
          <Link 
            href="/bookshelf" 
            passHref
            className="w-full"
            >
            <Button
              variant="secondary"
              className="flex items-center w-full gap-2"
              size="md"
              onClick={() => onTabChange?.('bookshelf')}
            >
              <BookOpen size={20} />
              <span>Estante</span>
            </Button>
          </Link>
      </nav>

      <div className="w-full h-px my-2 bg-[var(--olivy)]" aria-hidden="true" />

      <section className="flex flex-col items-center w-full py-4">
        <Button 
          variant="secondary"
          className="w-full mb-4"
          size="md"
          onClick={onNewBook}
        >
          Novo livro
        </Button>
        
        <h3 className="self-start px-2 text-sm font-semibold">
          Atualizar leituras:
        </h3>

        <article className="flex flex-col items-center w-full px-2">
          <img 
            src={recentBookCover} 
            alt="Capa do livro recente" 
            className="w-full mb-2 object-cover" 
          />
          <div className="w-full bg-gray-200 h-1 rounded mb-1">
            <div 
              className="h-full bg-[var(--olive)]" 
              style={{ width: `${progressPercent}%` }} 
            />
          </div>
          <p className="text-sm text-[var(--olive)]">
            {recentBookPagesRead}/{recentBookTotalPages} páginas
          </p>
        </article>
      </section>
    </aside>
  );
};

export default Sidebar;
