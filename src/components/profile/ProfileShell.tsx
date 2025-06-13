// components/profile/ProfileShell.tsx
'use client'

import { useSession } from 'next-auth/react'
import { useEffect, useState, useCallback } from 'react'
import Link from 'next/link'
import Image from 'next/image'

import { FollowButton, EditProfileButton  } from '@components/ui/Buttons'
import {
  PostCard,
  type PostWithRelations,
  type CommentWithAuthor,
} from '@components/post/Post'

/** ---------------------------------------------------------------
 * Tipagens de props – agora id → username
 * --------------------------------------------------------------*/
interface ProfileShellProps {
  initialUser: {
    username: string
    name: string
    email?: string
    avatarPath: string
    bio?: string
    followerUsernames: string[]
    followingUsernames: string[]
  }
  initialPosts: PostWithRelations[]
}

export default function ProfileShell({ initialUser, initialPosts }: ProfileShellProps) {
  const { data: session, status } = useSession()
  const meUsername = session?.user?.username
  const loggedIn = status === 'authenticated'

  const [user, setUser] = useState(initialUser)
  const [posts, setPosts] = useState(initialPosts)
  const [following, setFollowing] = useState(false)

  /** ───────────────── Verifica follow (GET /users/:username/follow) */
  useEffect(() => {
    if (!loggedIn) return
    fetch(`/api/users/${user.username}/follow`)
      .then(r => (r.ok ? r.json() : { following: false }))
      .then(d => setFollowing(Boolean(d.following)))
      .catch(console.error)
  }, [loggedIn, user.username])

  /** ───────────────── Seguir / deixar de seguir */
  const toggleFollow = useCallback(async () => {
    if (!loggedIn) return
    const method = following ? 'DELETE' : 'POST'
    const res = await fetch(`/api/users/${user.username}/follow`, { method })
    if (!res.ok) return

    // Atualiza estado local
    setFollowing(!following)
    setUser(prev => ({
      ...prev,
      followerUsernames: following
        ? prev.followerUsernames.filter(u => u !== meUsername)
        : [...prev.followerUsernames, meUsername!],
    }))
  }, [following, loggedIn, meUsername, user.username])

  /** ───────────────── Comentários */
  const handleAddComment = async (postId: string, text: string) => {
    const res = await fetch(`/api/posts/${postId}/comments`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text }),
    })
    if (!res.ok) return

    const newComment: CommentWithAuthor = await res.json()
    setPosts(prev =>
      prev.map(p =>
        p.id === postId
          ? {
              ...p,
              comments: [...p.comments, newComment],
              commentCount: p.commentsCount + 1,
            }
          : p,
      ),
    )
  }

  return (
    <section className="flex gap-6">
      <main className="flex-1 space-y-6">
        {/* Header do perfil */}
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

          {loggedIn && meUsername && meUsername !== user.username ? (
            <FollowButton
              targetUsername={user.username}
              initialFollowing={following}
              onToggle={setFollowing}
            />
          ) : (
            loggedIn && meUsername === user.username && (
              <EditProfileButton onClick={() => {/* TODO */}} />
            )
          )}
      
        </div>

        {posts.length ? (
          posts.map(post => (
            <PostCard key={post.id} post={post} onAddComment={handleAddComment} />
          ))
        ) : (
          <p className="text-center text-[var(--text-tertiary)]">Nenhum post ainda.</p>
        )}
      </main>
    </section>
  )
}
