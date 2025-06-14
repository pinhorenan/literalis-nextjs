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
  const { username } =  await params;

  const session = await getServerSession(authOptions);
  const me = session?.user?.username;
  const isOwner = !!me && me === username;

  const shelfItems = await prisma.userBook.findMany({
    where: { userUsername: username }, // campo correto!
    include: {
      book: {
        select: {
          isbn: true,
          title: true,
          author: true,
          pages: true,
          publisher: true,
          edition: true,
          language: true,
          publicationDate: true,
          coverUrl: true,
        },
      },
    },
    orderBy: { addedAt: 'desc' },
  });

  const initialItems = shelfItems.map((item) => ({
    book: item.book,
    progress: item.progress,
    addedAt: item.addedAt.toISOString(),
  }));

  return (
    <main className="w-full h-full p-4">
      <BookshelfClient
        initialItems={initialItems}
        username={username}
        isOwner={isOwner}
      />
    </main>
  );
}
