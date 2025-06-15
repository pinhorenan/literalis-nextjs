// File: src/components/profile/ProfileShell.tsx
'use client'

import { useSession } from 'next-auth/react';
import { useState, useCallback } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { BookOpen, MessageSquare } from 'lucide-react';

import { Button, FollowButton, EditProfileButton } from '@components/ui/Buttons';
import PostCard from '@components/post/Post';
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
  const [user, setUser] = useState(initialUser);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [followerCount, setFollowerCount] = useState(user.followerUsernames.length);
  
  const meUsername = session?.user.username;
  const loggedIn = status === 'authenticated';
  const initiallyFollowing = meUsername ? user.followerUsernames.includes(meUsername) : false;
  const isOwnProfile = loggedIn && meUsername === user.username;

  const handleFollowToggle = useCallback((nowFollowing: boolean) => {
    setFollowerCount((prev) => (nowFollowing ? prev + 1 : prev - 1));
  }, []);

  return (
    <>
      <section className="flex-1 py-6 space-y-6">
        {/* --- Cabeçalho do perfil --- */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-[var(--border-base)] pb-4">
          {/* --- Avatar do usuário --- */}
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
            <div className="flex items-center justify-between mb-4 pr-4">
              <h1 className="text-3xl font-bold">{user.name}</h1>
              
              <div className="flex items-center gap-4">
                <span>
                  <strong>{user.followingUsernames.length}</strong> Seguindo
                </span>
                <span>
                  <strong>{followerCount}</strong> Seguidores
                </span>
              </div>
            </div>

            {/* Bio */}
            <p className="mt-1 text-sm text-[var(--text-secondary)]">
              {user.bio || 'Sem bio ainda…'}
            </p>
            
            {/* Botões */}
            <div className="flex justify-between mt-3 gap-2 text-sm font-medium">
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
              {/* --- Botão de seguir ou editar perfil --- */}
              {loggedIn && !isOwnProfile ? (
                <FollowButton
                  targetUsername={user.username}
                  initialFollowing={initiallyFollowing}
                  onToggle={handleFollowToggle}
                  size="sm"
                  variant='outline'
                  className="flex-wrap mt-4"
                />
              ) : (
                isOwnProfile && (
                  <EditProfileButton
                    onClick={() => setIsModalOpen(true)}
                    size="sm"
                  />
                )
              )}
            </div>
          </div>
        </div>

        {/* ----- Posts do usuário ----- */}
        <div className="space-y-4">
          {initialPosts.length > 0 ? (
            initialPosts.map(post => (
              <PostCard key={post.id} post={post} isProfile />
            ))
          ) : (
            <p className="text-center text-[var(--text-tertiary)]">
              Nenhum post ainda.
            </p>
          )}
        </div>
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
