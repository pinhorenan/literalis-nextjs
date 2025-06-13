// File: src/components/profile/ProfileShell.tsx
'use client'

import { useSession } from 'next-auth/react';
import { useState, useCallback } from 'react';
import Link from 'next/link';
import Image from 'next/image';

import { FollowButton, EditProfileButton  } from '@components/ui/Buttons';
import EditProfileModal from '@components/profile/EditProfileModal';
import { PostCard, type PostWithRelations } from '@components/post/Post';

interface ProfileShellProps {
  initialUser: {
    username: string;
    name: string;
    email?: string;
    avatarPath: string;
    bio?: string;
    followerUsernames: string[];
    followingUsernames: string[];
  }
  initialPosts: PostWithRelations[]
};

export default function ProfileShell({ initialUser, initialPosts }: ProfileShellProps) {
  const { data: session, status } = useSession();
  const meUsername = session?.user.username;
  const loggedIn = status === 'authenticated';

  const [user, setUser] = useState(initialUser);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [followerCount, setFollowerCount] = useState(user.followerUsernames.length);
  
  const initiallyFollowing = meUsername ? user.followerUsernames.includes(meUsername) : false;
  
  const handleFollowToggle = useCallback((nowFollowing: boolean) => {
    setFollowerCount((prev) => (nowFollowing ? prev + 1 : prev - 1 ))
  }, []);
  
  const isOwnProfile = loggedIn && meUsername === user.username;

  return (
    <>
      <section className="flex gap-6">
        <main className="flex-1 space-y-6">
          {/* ----- Header do perfil ----- */}
          <div className="flex flex-col md:flex-row items-center gap-4 border-b pb-4">
            <Link href={`/profile/${user.username}`}>
              <Image
                src={user.avatarPath || '/assets/images/users/default.jpg'}
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
                  <strong>{user.followingUsernames.length}</strong> seguindo
                </span>
                <span>
                  <strong>{user.followerUsernames.length}</strong> seguidores
                </span>
              </div>
            </div>

            {loggedIn && !isOwnProfile ? (
              <FollowButton
                targetUsername={user.username}
                initialFollowing={
                  meUsername ? user.followerUsernames.includes(meUsername) : false 
                }
                onToggle={handleFollowToggle}
              />
            ) : (
              isOwnProfile && <EditProfileButton onClick={() => setIsModalOpen(true)} />
            )}
          </div>

          {/* ----- Posts do usuário ----- */}
          {initialPosts.length > 0 ? (
            initialPosts.map(post => (
              <PostCard key={post.id} post={post} />
            ))
          ) : (
            <p className="text-center text-[var(--text-tertiary)]">
              Nenhum post ainda.
              </p>
          )}
        </main>
      </section>

      <EditProfileModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        user={user}
        onSave={(updated) => setUser((prev) => ({ ...prev, ...updated }))}
      />
    </>
  )
}
