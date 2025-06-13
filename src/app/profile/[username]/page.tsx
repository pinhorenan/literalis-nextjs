// profile/[username]/page.tsx
import ProfileShell from '@components/profile/ProfileShell'
import { notFound } from 'next/navigation'
import { prisma } from '@server/prisma'

export default async function ProfilePage({ params }: { params: Promise<{ username: string }> }) {
  const { username } = await params;

  const user = await prisma.user.findUnique({
    where: { username },
    include: {
      followers: { select: { followerUsername: true } },
      following: { select: { followedUsername: true } },
    },
  })

  if (!user) return notFound()

  // Busca posts do usuário
  const rawPosts = await prisma.post.findMany({
    where: { authorUsername: username },
    include: {
      author: true,
      book: true,
      comments: { include: { author: true } },
      likes: true,
    },
    orderBy: { createdAt: 'desc' },
  })

  // Mapeia para PostWithRelations
  const posts = rawPosts.map(p => ({
    id: p.postId,
    authorId: p.authorUsername,
    bookIsbn: p.bookIsbn,
    excerpt: p.excerpt,
    progressPct: p.progressPct,
    createdAt: p.createdAt,
    updatedAt: p.updatedAt,
    commentsCount: p.commentCount,
    reactionsCount: p.likeCount,
    author: p.author,
    book: p.book,
    comments: p.comments,
    likes: p.likes,
    likedByMe: false,
    isFollowingAuthor: false,
  }))

  return (
    <ProfileShell
      initialUser={{
        username: user.username,
        name: user.name,
        avatarPath: user.avatarPath,
        bio: user.bio ?? undefined,
        followerUsernames: user.followers.map(f => f.followerUsername),
        followingUsernames: user.following.map(f => f.followedUsername),
      }}
      initialPosts={posts}
    />
  )
}
