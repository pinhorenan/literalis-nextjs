'use client'
import React from 'react'
import clsx from 'clsx'

export type ButtonVariant = 'primary' | 'secondary' 
export type ButtonSize    = 'sm' | 'md' | 'lg'

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant
  size?: ButtonSize
  active?: boolean
  className?: string
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size    = 'md',
  active  = false,
  disabled = false,
  className,
  ...rest
}) => {
  // 1. classes base
  const base = [
    'select-none',
    'focus:outline-none',
    'rounded-md',
    'transition-colors',
    'duration-200',
    'ease-in-out',
    'inline-flex',
    'items-center',
    'justify-center',
  ]

  // 2. tema
  const variantBase: Record<ButtonVariant, string> = {
    primary:   'border border-[var(--olive)]',
    secondary: 'border-2 border-[var(--olive)]',
  }
  const variantBg: Record<ButtonVariant, string> = {
    primary:   'bg-[var(--offwhite)] text-[var(--olive)]',
    secondary: 'bg-transparent text-[var(--olive)]',
  }
  const variantHover: Record<ButtonVariant, string> = {
    primary:   'hover:bg-[var(--olive)] hover:text-[var(--offwhite)]',
    secondary: 'hover:bg-[var(--olive)] hover:text-[var(--offwhite)]',
  }
  const variantActive: Record<ButtonVariant, string> = {
    primary:   'bg-[var(--offwhite)] text-[var(--olive)]',
    secondary: 'bg-[var(--olive)] text-[var(--offwhite)]',
  }

  // 3. tamanhos
  const sizes: Record<ButtonSize, string> = {
    sm: 'px-3 py-1 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg',
  }

  // 4. monta classes em ordem
  const classes = clsx(
    base,
    variantBase[variant],
    // se desativado, aplica opacidade + impede pointer
    disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer',
    // background / texto padrão
    variantBg[variant],
    // hover sempre incluso (Tailwind utilities)
    !disabled && variantHover[variant],
    // se active === true, sobrepõe
    active && variantActive[variant],
    // size e extras
    sizes[size],
    className,
  )

  return (
    <button className={classes} disabled={disabled} {...rest}>
      {children}
    </button>
  )
}
