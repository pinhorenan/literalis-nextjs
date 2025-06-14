// File: src/components/profile/ProfileShell.tsx
'use client'

import { useSession } from 'next-auth/react';
import { useState, useCallback } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { BookOpen, MessageSquare } from 'lucide-react';

import { Button, FollowButton, EditProfileButton } from '@components/ui/Buttons';
import { PostCard } from '@components/post/Post';
import EditProfileModal from '@components/profile/EditProfileModal';
import type { ClientPost } from '@/src/types/posts';

interface ClientUser {
  username: string;
  name: string;
  email?: string;
  avatarUrl: string;
  bio?: string;
  followerUsernames: string[];
  followingUsernames: string[];
}

interface ProfileShellProps {
  initialUser: ClientUser;
  initialPosts: ClientPost[];
}

export default function ProfileShell({ initialUser, initialPosts }: ProfileShellProps) {
  const { data: session, status } = useSession();
  const meUsername = session?.user.username;
  const loggedIn = status === 'authenticated';

  const [user, setUser] = useState(initialUser);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [followerCount, setFollowerCount] = useState(user.followerUsernames.length);

  const isOwnProfile = loggedIn && meUsername === user.username;
  const initiallyFollowing = meUsername ? user.followerUsernames.includes(meUsername) : false;

  const handleFollowToggle = useCallback((nowFollowing: boolean) => {
    setFollowerCount((prev) => (nowFollowing ? prev + 1 : prev - 1));
  }, []);

  return (
    <>
      <section className="flex gap-6">
        <main className="flex-1 mx-30  px-4 py-6 space-y-6 ">
          {/* ----- Header do perfil ----- */}
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b pb-4">
            {/* --- Avatar --- */}
            <Link href={`/profile/${user.username}`}>
              <Image
                src={user.avatarUrl}
                alt={user.name}
                width={96}
                height={96}
                className="rounded-full border"
              />
            </Link>

            {/* --- Informações do usuário --- */}
            <div className="flex-1">
              <h1 className="text-3xl font-bold">{user.name}</h1>
              <p className="mt-1 text-sm text-[var(--text-secondary)]">
                {user.bio || 'Sem bio ainda…'}
              </p>
              <div className="mt-3 flex gap-6 text-sm font-medium">
                <span>
                  <strong>{user.followingUsernames.length}</strong> seguindo
                </span>
                <span>
                  <strong>{followerCount}</strong> seguidores
                </span>
              </div>

              {/* --- Botão "Estante" e "Mensagem"*/}
              <div className="mt-4 flex flex-wrap gap-2">
                <Link href={`/profile/${user.username}/shelf`}>
                  <Button variant="outline" size="sm" className="gap-1">
                    <BookOpen size={16} /> Estante
                  </Button>
                </Link>
                {loggedIn && !isOwnProfile && (
                  <Link href={`/messages/${user.username}`}>
                    <Button variant="outline" size="sm" className="gap-1">
                      <MessageSquare size={16} /> Mensagem
                    </Button>
                  </Link>
                )}
              </div>
            </div>

            {/* --- Botão de seguir/editar perfil --- */}
            <div>
              {loggedIn && !isOwnProfile ? (
                <FollowButton
                  targetUsername={user.username}
                  initialFollowing={initiallyFollowing}
                  onToggle={handleFollowToggle}
                  size="md"
                />
              ) : (
                isOwnProfile && (
                  <EditProfileButton
                    onClick={() => setIsModalOpen(true)}
                    size="md"
                  />
                )
              )}
            </div>
          </div>

          {/* ----- Posts do usuário ----- */}
          <div className="space-y-4">
            {initialPosts.length > 0 ? (
              initialPosts.map(post => (
                <PostCard key={post.postId} post={post} isProfile />
              ))
            ) : (
              <p className="text-center text-[var(--text-tertiary)]">
                Nenhum post ainda.
              </p>
            )}
          </div>
        </main>
      </section>

      <EditProfileModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        user={user}
        onSave={(updated) => setUser((prev) => ({ ...prev, ...updated }))}
      />
    </>
  );
}
