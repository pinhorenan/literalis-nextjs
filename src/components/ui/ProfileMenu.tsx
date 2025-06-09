// components/ui/ProfileMenu.tsx
'use client';

import { useState, useRef } from 'react';
import { signOut } from 'next-auth/react';
import useClickOutside from '@hooks/useClickOutside';

type MenuItem = { label: string; onClick: () => void };

export default function ProfileMenu({
  avatarSrc,
  userName,
  onLogout,
  items = [],
}: {
  avatarSrc: string;
  userName: string;
  onLogout: () => void;
  items?: MenuItem[];
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  useClickOutside(ref, () => setOpen(false));

  const menu: MenuItem[] = [
    { label: 'Perfil', onClick: () => location.assign('/profile') },
    { label: 'Estante', onClick: () => location.assign('/shelf') },
    { label: 'Configurações', onClick: () => location.assign('/preferences') },
    { label: 'Sair', onClick: onLogout ?? (() => signOut({ callbackUrl: '/' })) },
    ...items,
  ]

  return (
    <div ref={ref} className="relative">
      <button
        aria-label="Abrir menu de perfil"
        onClick={() => setOpen(o => !o)}
        className="p-0 rounded-full border-2 border-[var(--surface-card)] overflow-hidden"
      >
        <img src={avatarSrc} alt={userName} className="w-10 h-10 object-cover" />
      </button>

      {open && (
        <div
          role="menu"
          className="
            absolute right-0 mt-2 w-48 z-50
            rounded-md shadow-lg
            bg-[var(--surface-card)]
            border border-[var(--border-base)]  
          "
        >
          {menu.map(({ label, onClick }) => (
            <button
              key={label}
              onClick={() => { onClick(); setOpen(false); }}
              className="
                w-full text-left px-4 py-2 text-sm
                text-[var(--text-primary)]
                hover:bg-[var(--surface-card-hover)]
              "
            >
              {label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}