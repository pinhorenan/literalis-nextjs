// File: src/componentes/book/BookCover.tsx
'use client';

import Image from 'next/image';
import Link from 'next/link';
import clsx from 'clsx';
import { Plus } from 'lucide-react';
import { useSession } from 'next-auth/react';

interface BookCoverProps {
    src: string;
    alt: string;
    width?: number;
    height?: number;
    href?: string;
    addable?: boolean;
    onAdded?: () => void;
    className?: string;
}

export function BookCover({
    src,
    alt,
    width = 120,
    height = 180,
    href,
    addable = false,
    onAdded,
    className ,
}: BookCoverProps) {
    const { data: session } = useSession();
    const username = session?.user?.username;

    async function addToShelf(e: React.MouseEvent) {
        e.preventDefault();
        if (!username) return;
        await fetch(`/api/users/${username}/shelf`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ isbn: href?.split('/').pop() }),
        });
        onAdded?.();
    }

    const img = (
        <div className="relative group">
            <Image
                src={src}
                alt={alt}
                width={width}
                height={height}
                className={clsx('rounded object-contain border', className)}
            />
            {addable && (
                <button
                    onClick={addToShelf}
                    className="
                        absolute inset-0 flex items-center justify-center
                        bg-black/0 hover:bg-black/40 transition
                        opacity-0 group-hover:opacity-100
                    "
                    aria-label="Adicionar à estante"
                >
                    <Plus className="w-6 h-6 text-white" />
                </button>
            )}
        </div>
    );

    return href ? <Link href={href}>{img}</Link> : img;
}

export function BookCoverSkeleton({
    width = 120,
    height = 180,
    className = '',
}: {
    width?: number;
    height?: number;
    className?: string;
}) {
    return (
        <div
            className={`bg-[var(--surface-card)] border border-[var(--border-base)] rounded ${className} animate-pulse`}
            style={{ width, height }}
        />
    );
}