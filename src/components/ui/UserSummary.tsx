// File: src/components/ui/UserSummary.tsx
'use client';

import { useSession } from 'next-auth/react';
import Image from 'next/image';
import Link from 'next/link';

export default function UserSummary() {
    const { data: session, status } = useSession();

    if (status === 'loading') {
        return <p className="text-sm text-[var-(--text-tertiary)]">Carregando...</p> // todo: fazer um skeleton?
    }

    const user = session?.user;    
    const name = user?.name ?? 'Visitante';
    const avatarUrl = user?.image ?? '/assets/avatars/system.jpg';

    return (
        <div className="flex items-center gap-3">
            <Image
                src={avatarUrl} alt={name}
                width={48} height={48}
                className="rounded-full border"
            />
            <div>
                {user?.username && (
                    <Link 
                        href={`/profile/${user.username}/`} 
                        className=" text-[var(--text-primary)]"
                    >
                        {name}
                    </Link>
                )}
                {user?.email && (
                    <p className="text-xs text-[var(--text-tertiary)]">
                        {user.email}
                    </p>
                )}
            </div>
        </div>
    );
}