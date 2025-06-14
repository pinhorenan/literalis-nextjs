// File: src/components/sidebar/PrimarySidebar.tsx
'use client';

import Link from 'next/link';
import { useSession } from 'next-auth/react';
import { User, Users, Globe, BookOpen, Search, MessageSquare, Bell } from 'lucide-react';
import { SidebarShell } from '@components/layout/SidebarShell';
import { LogoutMenu } from '@components/ui/LogoutMenu';
import { Button } from '@components/ui/Buttons';


export function PrimarySidebar() {
    const { data: session } = useSession();
    const username = session?.user?.username;
    
    const nav = [
        { label: 'Perfil',          icon: User,            href: `/profile/${username}`         },
        { label: 'Amigos',          icon: Users,           href: '/friends'                     },
        { label: 'Explorar',        icon: Globe,           href: '/feed'                        },
        { label: 'Estante',         icon: BookOpen,        href: `/profile/${username}/shelf/`  },
        { label: 'Pesquisar',       icon: Search,          href: '/search'                      },
        { label: 'Notificações',    icon: Bell,            href: '/notifications'               },
        { label: 'Mensagens',       icon: MessageSquare,   href: '/message'                     },
    ];

    return (
        <SidebarShell position="left">
            <div className="flex flex-col h-full">
                <Link href="/">
                    <Button
                        variant="logo"
                        logoSrc="/assets/icons/dark/main_logo.svg"
                        logoSize={140}
                        logoAlt="Logo do site"
                        aria-label="Logo do site"
                        className="mb-2"
                    />
                </Link>

                <nav className="flex flex-col gap-1">
                    {nav.map(({ label, icon: Icon, href }) => (
                        <Link key={label} href={href}>
                            <Button
                                variant="default"
                                className="bg-transparent hover:bg-[var(--surface-card-hover)] gap-3 rounded-lg border-none"
                            >
                                <Icon size={30} className="text-[var(--text-secondary)]" />
                                <strong className="text-lg text-[var(--text-secondary)]">{label}</strong>
                            </Button>
                        </Link>
                    ))}
                </nav>

                <LogoutMenu />
            </div>
        </SidebarShell>
    );
}