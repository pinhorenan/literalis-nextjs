// componentes/book/BookCover.tsx
'use client';

import Image from 'next/image';
import Link from 'next/link';
import clsx from 'clsx';

interface BookCoverProps {
    src: string;
    alt: string;
    width?: number;
    height?: number;
    href?: string;
    className?: string;
}

export function BookCover({
    src,
    alt,
    width = 120,
    height = 180,
    href,
    className ,
}: BookCoverProps) {
    const img = (
        <Image
            src={src}
            alt={alt}
            width={width}
            height={height}
            className={clsx('rounded object-cover border', className)}
        />
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