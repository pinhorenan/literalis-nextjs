// File: src/types/posts.ts
import type { Prisma } from '@prisma/client';

/** Payload bruto do banco, usado só no backend */
export type RawPost = Prisma.PostGetPayload<{
  include: {
    author: true;
    book: true;
    comments: { include: { author: true } };
    likes: true;
  };
}>;

/** Comentário no cliente */
export type ClientComment = {
  id: string;
  content: string;
  createdAt: string;
  author: {
    username: string;
    name?: string;
    avatarUrl?: string;
  };
};

/** Post processado para o frontend */
export type ClientPost = {
  id: string;
  excerpt: string;
  progress: number;
  createdAt: string;
  updatedAt: string;
  likeCount: number;
  commentCount: number;
  likedByMe: boolean;
  isFollowingAuthor: boolean;

  author: {
    username: string;
    name: string;
    avatarUrl: string;
  };

  book: {
    isbn: string;
    title: string;
    author: string;
    coverUrl: string;
    publisher?: string;
    edition?: number;
    language?: string;
    pages?: number;
    publicationDate?: string;
  };

  comments: ClientComment[];
};
