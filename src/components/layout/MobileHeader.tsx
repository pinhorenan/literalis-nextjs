// File: src/components/layout/MobileHeader.tsx
'use client';

import { useState, useRef, useEffect } from 'react';
import { Bell, MessageSquare, LogOut, Sun, Moon } from 'lucide-react';
import { useTheme } from 'next-themes';
import { useSession, signOut } from 'next-auth/react';
import Link from 'next/link';
import clsx from 'clsx';

export default function MobileHeader() {
  const { data: session } = useSession();
  const [show, setShow] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [atTop, setAtTop] = useState(true);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Tema
  const { resolvedTheme, setTheme } = useTheme();
  const isDark = resolvedTheme === 'dark';

  // Scroll hide/show logic
  useEffect(() => {
    const handleScroll = () => {
      const currentScroll = window.scrollY;
      setAtTop(currentScroll === 0);

      if (currentScroll <= 0) {
        setShow(true);
        setLastScrollY(0);
        return;
      }

      if (currentScroll > lastScrollY && currentScroll > 32) {
        setShow(false); // rolando para baixo, esconde
      } else if (currentScroll < lastScrollY) {
        setShow(true); // rolando para cima, mostra
      }
      setLastScrollY(currentScroll);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
    // eslint-disable-next-line
  }, [lastScrollY]);

  // Dropdown: clique fora fecha
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    }
    if (dropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [dropdownOpen]);

  return (
    <header
      className={clsx(
        "lg:hidden fixed top-0 left-0 right-0 z-50 transition-transform duration-300 bg-[var(--surface-bg)] border-b border-[var(--border-base)]",
        show ? "translate-y-0" : "-translate-y-full"
      )}
      style={{ boxShadow: atTop ? 'none' : '0 2px 12px #0001' }}
    >
      <div className="flex items-center justify-between px-4 py-2 h-14">
        {/* Ghost Logo Button */}
        <div className="relative">
          <button
            onClick={() => setDropdownOpen((v) => !v)}
            className="px-3 py-1 rounded-lg font-serif font-semibold text-lg bg-transparent text-[var(--text-primary)] hover:bg-[var(--surface-card-hover)] transition focus:outline-none"
            aria-label="Menu"
            type="button"
          >
            Literalis
          </button>
          {dropdownOpen && (
            <div
              ref={dropdownRef}
              className="absolute left-0 mt-2 w-40 rounded-xl shadow-lg bg-[var(--surface-card)] py-2 z-50 border"
            >
              <button
                onClick={() => {
                  setTheme(isDark ? 'light' : 'dark');
                  setDropdownOpen(false);
                }}
                className="w-full flex items-center px-4 py-2 text-sm gap-2 hover:bg-[var(--surface-card-hover)] transition"
              >
                {isDark ? <Sun size={18} /> : <Moon size={18} />}
                {isDark ? 'Tema claro' : 'Tema escuro'}
              </button>
              <button
                onClick={() => signOut({ callbackUrl: '/' })}
                className="w-full flex items-center px-4 py-2 text-sm gap-2 hover:bg-[var(--surface-card-hover)] transition"
              >
                <LogOut size={18} />
                Sair
              </button>
            </div>
          )}
        </div>

        {/* Icons à direita */}
        <div className="flex items-center gap-4">
          <Link href="/feed" className="relative">
            <MessageSquare size={24} />
          </Link>
          <Link href="/feed" className="relative">
            <Bell size={24} />
          </Link>
        </div>
      </div>
    </header>
  );
}
