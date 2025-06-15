// File: src/components/layout/MobileBottomNav.tsx
'use client';

import { Home, Search, User, BookOpen } from 'lucide-react';
import { useSession } from 'next-auth/react';
import Link from 'next/link';

const navItems = [
    { icon: Home,       href: '/feed',              label: 'Início' },
    { icon: Search,     href: '/search',            label: 'Buscar' },
    { icon: BookOpen,   href: '/profile/me/shelf',  label: 'Estante' },
    { icon: User,       href: '/profile/me',        label: 'Perfil' },
];

export default function MobileBottomNav() {
    const { data: session } = useSession();
    const username = session?.user?.username;

    return (
        <nav className="fixed bottom-0 left-0 right-0 z-50 bg-[var(--surface-bg)] border-t border-[var(--border-base)] flex justify-around py-2 md:hidden">
            {navItems.map(({ icon: Icon, href, label }) => {
                const path = href.includes('me') && username ? href.replace('me', username) : href;
                return (
                    <Link key={label} href={path} className="flex flex-col items-center text-sm text-[var(--text-secondary)]">
                        <Icon size={24} />
                        <span className="text-xs mt-1">{label}</span>
                    </Link>
                );
            })}
        </nav>
    );
}