// app/feed/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { MainSidebar, RecommendedSidebar } from '@components/layout/Sidebar';
import PostCard, { PostWithRelations, CommentWithAuthor } from '@components/feed/PostCard';

export default function PageFeed() {
  const [posts, setPosts] = useState<PostWithRelations[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  // carrega posts
  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const res = await fetch('/api/posts');
        if (!res.ok) throw new Error('Erro ao carregar posts');
        const data: PostWithRelations[] = await res.json();
        setPosts(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  // adiciona comentário e incrementa commentsCount localmente
  const handleAddComment = async (postId: string, text: string) => {
    try {
      const res = await fetch(`/api/posts/${postId}/comments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text }),
      });
      if (!res.ok) throw new Error('Falha ao enviar comentário');
      const newComment: CommentWithAuthor = await res.json();
      setPosts(prev =>
        prev.map(p =>
          p.id === postId
            ? {
                ...p,
                comments: [...p.comments, newComment],
                commentsCount: p.commentsCount + 1,
              }
            : p
        )
      );
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <section className="flex gap-4 align-middle">
      <MainSidebar/>
      <main className="px-4 py-6 space-y-6 mx-auto">
        {loading  ? (<p className="text-center">Carregando feed…</p>) 
                  : posts.length === 0 
                  ? (<p className="text-center text-[var(--text-tertiary)]">Não há posts para mostrar.</p>) 
                  : (posts.map(post => (<PostCard key={post.id} post={post} onAddComment={handleAddComment} />)) )
        }
      </main>
      <RecommendedSidebar />
    </section>
  );
}
