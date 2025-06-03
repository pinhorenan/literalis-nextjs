// components/ProfileMenu.tsx
'use client';
import React, { useState, useRef, useEffect } from 'react';

interface MenuItem {
  label: string;
  onClick: () => void;
}

interface ProfileMenuProps {
  avatarSrc: string;
  items?: MenuItem[];
}

export default function ProfileMenu({
  avatarSrc,
  items = [
    { label: 'Meu Perfil',    onClick: () => {} },
    { label: 'Amigos',         onClick: () => {} },
    { label: 'Estante',        onClick: () => {} },
    { label: 'Configurações',  onClick: () => {} },
    { label: 'Sair',           onClick: () => {} },
  ],
}: ProfileMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Fecha ao clicar fora
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div ref={containerRef} className="relative">
      <button
        onClick={() => setIsOpen(v => !v)}
        aria-haspopup="menu"
        aria-expanded={isOpen}
        className="focus:outline-none"
      >
        <img
          src={avatarSrc}
          alt="Perfil"
          className="w-8 h-8 rounded-full border-2 border-[var(--olive)]"
        />
      </button>

      {isOpen && (
        <div
          role="menu"
          className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg ring-1 ring-black ring-opacity-5 z-50"
        >
          <div className="py-1">
            {items.map(({ label, onClick }) => (
              <button
                key={label}
                onClick={() => {
                  onClick();
                  setIsOpen(false);
                }}
                role="menuitem"
                className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                {label}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
