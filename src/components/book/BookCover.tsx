// File: src/components/book/BookCover.tsx
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
  className,
}: BookCoverProps) {
  const { data: session } = useSession();
  const username = session?.user?.username;

  async function addToShelf(e: React.MouseEvent) {
    e.preventDefault();
    if (!username || !href) return;

    const isbn = href.split('/').pop();
    if (!isbn) return;

    try {
      const res = await fetch(`/api/users/${username}/shelf`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isbn }),
      });
      if (res.ok) onAdded?.();
    } catch (err) {
      console.error('Erro ao adicionar livro à estante:', err);
    }
  }

  const imageElement = (
    <div className={clsx('relative group', className)}>
      <Image
        src={src}
        alt={alt}
        width={width}
        height={height}
        className="rounded object-contain border"
      />
      {addable && href && (
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

  return href ? <Link href={href}>{imageElement}</Link> : imageElement;
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
      className={clsx(
        'bg-[var(--surface-card)] border border-[var(--border-base)] rounded animate-pulse',
        className
      )}
      style={{ width, height }}
    />
  );
}
