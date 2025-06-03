'use client';

import { useState, useEffect } from 'react';
import PostCard from '@/src/components/feed/PostCard';

import type { Post, User, Book, Comment } from '@prisma/client';

type CommentWithAuthor = Comment & { author: User };
type PostWithRelations = Post & {
  author: User;
  book:   Book;
  comments: CommentWithAuthor[];
};

export default function FeedPage() {
  const [posts, setPosts] = useState<PostWithRelations[]>([]);

  // busca única
  useEffect(() => {
    fetch('/api/posts')
      .then(resp => resp.json())
      .then(setPosts)
      .catch(console.error);
  }, []);

  async function addCommentToPost(postId: string, authorId: string, text: string) {
    try {
      const resp = await fetch('/api/comments', {
        method: "POST",
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ postId, authorId, text }),
      });
      if (!resp.ok) throw new Error('Falha ao enviar comentário');
      const newComment: CommentWithAuthor = await resp.json();

      // atualiza o estado local
      setPosts(prev =>
        prev.map(p =>
          p.id === postId ? { ...p, comments: [newComment, ...p.comments] } : p
        )
      );
    } catch (error) {
      console.error(error);
    }
  }

  // render
  return (
    <div className="flex flex-col gap-6 p-4">
      {posts.map(post => (
        <PostCard
          key={post.id}
          post={post}
          author={post.author}
          book={post.book}
          comments={post.comments}
          onAddComment={txt => addCommentToPost(post.id, post.author.id, txt)}
        />
      ))}
    </div>
  )
}