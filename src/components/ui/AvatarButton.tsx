'use client';

import { Button } from '@/src/components/ui/Buttons';

export default function AvatarButton({ src, size = 32, alt = "Perfil" }: { src: string; size?: number; alt?: string }) {
  return (
    <Button variant="icon" className="p-0 rounded-full overflow-hidden">
      <img src={src} width={size} height={size} alt={alt} />
    </Button>
  )
}