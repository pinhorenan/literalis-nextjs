'use client'

import { useState }                   from 'react'
import { useRouter }                  from 'next/navigation'      // ou 'next/router' se estiver usando pages-router
import { MessageSquare, Bell, Menu }  from 'lucide-react'

import { Logo }                       from '@/src/components/ui/Logo'
import { IconButton }                 from '@/src/components/ui/IconButton'
import { SearchBar }                  from '@/src/components/search/SearchBar'
import ProfileMenu                    from '@/src/components/layout/ProfileMenu'

export function Header() {
  const [searchValue, setSearchValue] = useState<string>('')
  const router = useRouter()

  const handleSearch = () => {
    const q = searchValue.trim();
    if (!q) return
    router.push(`/search/${encodeURIComponent(q)}`)
  }

  return (
    <header className="sticky top-0 z-[100] flex items-center justify-between h-20 px-4 md:px-32 bg-[var(--olivy)] backdrop-blur border-b border-brand-brown-border">
      <div className="flex items-center gap-4">
        <IconButton icon={Menu} aria-label="Abrir menu" className="lg:hidden" />
        <Logo size={45} className="block" />
      </div>

      {/* Aqui estão as props exatas que o SearchBar espera: */}
      <SearchBar
        value={searchValue}
        onChange={setSearchValue}
        onSearch={handleSearch}
      />

      <div className="flex items-center gap-4">
        <IconButton icon={MessageSquare} title="Mensagens" />
        <IconButton icon={Bell} title="Notificações" />
        <ProfileMenu avatarSrc="/assets/images/users/diego.jpg" />
      </div>
    </header>
  )
}
