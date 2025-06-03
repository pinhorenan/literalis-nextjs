// src/components/ui/Logo.tsx
import Link from 'next/link'
import Image from 'next/image'
import React from 'react'

interface LogoProps {
  /** Largura e altura do logo em pixels */
  size?: number
  /** Classes adicionais de Tailwind/estilo */
  className?: string
  /** Texto altível para acessibilidade */
  alt?: string
}

/**
 * Componente de logo clicável que leva à home ("/").
 */
export function Logo({
  size = 32,
  className = '',
  alt = 'Literalis'
}: LogoProps) {
  return (
    <Link href="/" className={`inline-block ${className}`}>
      <Image
        src="/assets/icons/logo_small.svg"
        alt={alt}
        width={size}
        height={size}
        priority
      />
    </Link>
  )
}
