'use client'

import React, { useEffect, useState } from 'react'
import clsx from 'clsx'
import Link from 'next/link'
import Image from 'next/image'
import { Sun, Moon } from 'lucide-react'
import { useTheme } from 'next-themes'

/* -------------------------------------------------------------------------- */
/*                             TIPOS COMPARTILHADOS                            */
/* -------------------------------------------------------------------------- */
export type ButtonVariant = 'default' | 'icon' | 'logo'
export type ButtonSize    = 'sm' | 'md' | 'lg'

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /** Tipo do botão: padrão, só ícone, ou logo clicável */
  variant?:   ButtonVariant
  /** Tamanho geral do padding/fonte */
  size?:      ButtonSize
  /** Estado ativo (aplica ring ou fill) */
  active?:    boolean
  className?: string
  /** Link opcional */
  href?:      string
  /** Ícone para variante icon */
  icon?:      React.ElementType | React.ReactElement
  iconSize?:  number
  /** Fonte da logo para variante logo */
  logoSrc?:   string
  logoAlt?:   string
  logoSize?:  number
}

/* -------------------------------------------------------------------------- */
/*                                ESTILOS COMUNS                               */
/* -------------------------------------------------------------------------- */
const baseClasses = [
  'select-none',
  'focus:outline-none',
  'transition-colors',
  'duration-200',
  'ease-in-out',
  'inline-flex',
  'items-center',
  'justify-center',
]

const variantStyles: Record<ButtonVariant, string> = {
  default: 'rounded-md border border-[var(--border-color)] bg-[var(--surface-bg)] text-[var(--text-primary)] hover:bg-[var(--color-olive)] hover:text-[var(--color-offwhite)]',
  icon:    'rounded-full bg-transparent text-[var(--color-primary)]',
  logo:    'bg-transparent p-0',
}

const sizeStyles: Record<ButtonSize, string> = {
  sm: 'p-2 text-sm',
  md: 'p-3 text-base',
  lg: 'p-4 text-lg',
}

/* -------------------------------------------------------------------------- */
/*                                 COMPONENTE                                  */
/* -------------------------------------------------------------------------- */
export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant    = 'default',
      size       = 'md',
      active     = false,
      disabled   = false,
      className,
      href,
      icon,
      iconSize   = 24,
      logoSrc,
      logoAlt    = 'logo',
      logoSize   = 32,
      onClick,
      children,
      ...rest
    },
    ref,
  ) => {
    const isIcon = variant === 'icon'
    const isLogo = variant === 'logo'

    const classes = clsx(
      baseClasses,
      variantStyles[variant],
      sizeStyles[size],
      disabled && 'opacity-50 cursor-not-allowed',
      !disabled && !href && 'cursor-pointer',
      active && (isIcon ? 'fill-current' : 'ring-2 ring-[var(--color-primary)]'),
      className,
    )

    // Handle Link separately: only pass href, className, children, onClick
    if (href) {
      return (
        <Link href={href} className={classes} onClick={onClick as any}>
          {isIcon && icon
            ? React.isValidElement(icon)
              ? icon
              : React.createElement(icon as React.ElementType, { size: iconSize, className: clsx(active ? 'fill-current' : 'hover:fill-current') })
            : isLogo && logoSrc
            ? <Image src={logoSrc} alt={logoAlt} width={logoSize} height={logoSize} />
            : children
          }
        </Link>
      )
    }

    // Native button
    return (
      <button
        ref={ref}
        className={classes}
        disabled={disabled}
        onClick={onClick}
        {...rest}
      >
        {isIcon && icon
          ? React.isValidElement(icon)
            ? icon
            : React.createElement(icon as React.ElementType, { size: iconSize, className: clsx(active ? 'fill-current' : 'hover:fill-current') })
          : isLogo && logoSrc
          ? <Image src={logoSrc} alt={logoAlt} width={logoSize} height={logoSize} />
          : children
        }
      </button>
    )
  },
)
Button.displayName = 'Button'

/* -------------------------------------------------------------------------- */
/*                               TOGGLE DE TEMA                                */
/* -------------------------------------------------------------------------- */
export function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])
  if (!mounted) return null
  const isDark = resolvedTheme === 'dark'

  return (
    <Button
      variant="icon"
      icon={isDark ? Moon : Sun}
      iconSize={24}
      active={isDark}
      onClick={() => setTheme(isDark ? 'light' : 'dark')}
    />
  )
}
