// File: src/app/profile/[username]/shelf/page.tsx

import type { Metadata } from 'next';
import { getServerSession } from 'next-auth';
import { authOptions } from '@server/auth';
import { prisma } from '@server/prisma';

import BookshelfClient from '@components/shelf/BookshelfClient';

interface ShelfPageProps {
  params: { username: string };
}

export const metadata: Metadata = {
  title: 'Estante - Literalis',
};

export default async function ShelfPage({ params }: ShelfPageProps) {
  const { username } = params;

  const session = await getServerSession(authOptions);
  const isOwner = session?.user?.username === username;

  const shelfItems = await prisma.userBook.findMany({
    where: { username },
    include: { book: true },
  });

  const initialItems = shelfItems.map(item => ({
    book: {
      ...item.book,
      coverPath: item.book.coverPath,
    },
    progress: item.progress,
    addedAt: item.addedAt.toISOString(),
  }));

  return (
      <main className="flex-1 w-full h-full p-4">
        <BookshelfClient 
          initialItems={initialItems} 
          username={username}
          isOwner={isOwner} 
          />
      </main>
  );
}