// components/profile/ProfileShell.tsx
'use client';

import { useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';

import { Button } from '@components/ui/Buttons';
import PostCard, { CommentWithAuthor, PostWithRelations } from '@components/feed/PostCard';

import Image from 'next/image';
import Link from 'next/link';

interface ProfileShellProps {
  initialUser: {
    id: string;
    username: string;
    name: string;
    email?: string;
    avatarPath: string;
    bio?: string;
    followerIds: string[];
    followingIds: string[];
  };
  initialPosts: PostWithRelations[];
}

export default function ProfileShell({
  initialUser,
  initialPosts,
}: ProfileShellProps) {
  const { data: session, status } = useSession();
  const meId = session?.user?.id;

  const [user, setUser] = useState(initialUser);
  const [posts, setPosts] = useState(initialPosts);
  const [following, setFollowing] = useState(false);

  /* ------------------------------------------------------------ *
   *  SE EU JÁ SIGO ESSE PERFIL                                   *
   * ------------------------------------------------------------ */
  useEffect(() => {
    if (status !== 'authenticated') return;
    fetch(`/api/users/${user.id}/follows/me`)
      .then(r => r.json())
      .then(d => setFollowing(Boolean(d.follows)))
      .catch(console.error);
  }, [status, user.id]);

  /* ------------------------------------------------------------ *
   *  FOLLOW / UNFOLLOW                                           *
   * ------------------------------------------------------------ */
  const toggleFollow = async () => {
    if (status !== 'authenticated') return;
    const method = following ? 'DELETE' : 'POST';
    const res = await fetch(`/api/users/${user.id}/follow`, { method });
    if (!res.ok) return;

    setFollowing(!following);
    setUser(prev => ({
      ...prev,
      followerIds: following
        ? prev.followerIds.filter(id => id !== meId)
        : [...prev.followerIds, meId!],
    }));
  };

  /* ------------------------------------------------------------ *
   *  ADD COMMENT (incrementa commentsCount localmente)           *
   * ------------------------------------------------------------ */
  const handleAddComment = async (postId: string, text: string) => {
    const res = await fetch(`/api/posts/${postId}/comments`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text }),
    });
    if (!res.ok) return;

    const newComment: CommentWithAuthor = await res.json();
    setPosts(prev =>
      prev.map(p =>
        p.id === postId
          ? {
              ...p,
              comments: [...p.comments, newComment],
              commentsCount: p.commentsCount + 1, // ✅ novo campo
            }
          : p,
      ),
    );
  };

  /* ------------------------------------------------------------ *
   *  RENDER                                                      *
   * ------------------------------------------------------------ */
  return (
    <section className="flex gap-6">
      {/* — Lateral esquerda (vazia ou Sidebar) — */}
      <aside className="w-64 hidden lg:block">{/* <Sidebar variant="main" /> */}</aside>

      {/* — Conteúdo principal — */}
      <main className="flex-1 space-y-6">
        {/* HEADER DO PERFIL */}
        <div className="flex flex-col md:flex-row items-center gap-4 border-b pb-4">
          <Link href={`/profile/${user.id}`}>
            <Image
              src={user.avatarPath || '/assets/avatar_placeholder.svg'}
              alt={user.name}
              width={96}
              height={96}
              className="rounded-full border"
            />
          </Link>

          <div className="flex-1">
            <h1 className="text-3xl font-bold">{user.name}</h1>
            <p className="text-sm text-[var(--text-secondary)]">
              {user.bio || 'Sem bio ainda…'}
            </p>
            <div className="flex gap-6 mt-2 text-sm">
              <span>
                <strong>{user.followingIds.length}</strong> seguindo
              </span>
              <span>
                <strong>{user.followerIds.length}</strong> seguidores
              </span>
            </div>
          </div>

          {meId && meId !== user.id ? (
            <Button size="sm" variant="default" onClick={toggleFollow}>
              {following ? 'Deixar de seguir' : 'Seguir'}
            </Button>
          ) : (
            meId === user.id && (
              <Button
                size="sm"
                variant="default"
                onClick={() => {
                  /* abrir modal de edição */
                }}
              >
                Editar perfil
              </Button>
            )
          )}
        </div>

        {/* FEED DE POSTS */}
        {posts.length ? (
          posts.map(post => (
            <PostCard
              key={post.id}
              post={post}
              onAddComment={handleAddComment}
            />
          ))
        ) : (
          <p className="text-center text-[var(--text-tertiary)]">
            Nenhum post ainda.
          </p>
        )}
      </main>

      {/* — Lateral direita (recomendações) — */}
      <aside className="w-64 hidden lg:block">
        {/* <Sidebar variant="recommended" /> */}
      </aside>
    </section>
  );
}
