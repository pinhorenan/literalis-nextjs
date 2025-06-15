// File: src/app/profile/[username]/bookshelf/page.tsx

import { getServerSession } from 'next-auth';
import { authOptions }      from '@server/auth';
import { prisma }           from '@server/prisma';

import BookshelfClient from '@components/bookshelf/BookshelfClient';

interface BookshelfPageProps {
  params: { username: string };
}

export default async function BookshelfPage({ params }: BookshelfPageProps) {
  const { username } =  params;

  const session = await getServerSession(authOptions);
  const me = session?.user?.username;
  const isOwner = !!me && me === username;

  const bookshelfItems = await prisma.userBook.findMany({
    where: { userUsername: username },
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

  const initialItems = bookshelfItems.map((item) => ({
    book:     item.book,
    progress: item.progress,
    addedAt:  item.addedAt.toISOString(),
  }));

  return (
    <section className="py-6 space-y-6">
      <BookshelfClient
        initialItems={initialItems}
        username={username}
        isOwner={isOwner}
      />
    </section>
  );
}
