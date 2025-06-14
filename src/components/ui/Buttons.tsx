// File: src/components/ui/Buttons.tsx
'use client'

import React, { useEffect, useState } from 'react'
import clsx from 'clsx'
import Link from 'next/link'
import Image from 'next/image'
import { Sun, Moon, Users } from 'lucide-react'
import { useTheme } from 'next-themes'
import { useFollow } from '@hooks/useFollow'

export type ButtonVariant = 'default' | 'icon' | 'logo' | 'outline' | 'destructive'
export type ButtonSize = 'xs' | 'sm' | 'md' | 'lg'

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant
  size?: ButtonSize
  active?: boolean
  className?: string
  href?: string
  icon?: React.ElementType | React.ReactElement
  iconSize?: number
  logoSrc?: string
  logoAlt?: string
  logoSize?: number
}

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
  icon: 'rounded-full bg-transparent text-[var(--text-primary)]',
  logo: 'bg-transparent p-0',
  outline: 'rounded-md border border-[var(--border-color)] bg-transparent text-[var(--text-primary)] hover:bg-[var(--surface-bg)]',
  destructive: 'rounded-md bg-red-600 text-white hover:bg-red-700',
}

const sizeStyles: Record<ButtonSize, string> = {
  xs: 'p-1 text-xs',
  sm: 'p-2 text-sm',
  md: 'p-3 text-base',
  lg: 'p-4 text-lg',
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = 'default',
      size = 'md',
      active = false,
      disabled = false,
      className,
      href,
      icon,
      iconSize = 24,
      logoSrc,
      logoAlt = 'logo',
      logoSize = 32,
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

    if (href) {
      return (
        <Link href={href} className={classes} onClick={onClick as any}>
          {isIcon && icon ? (
            React.isValidElement(icon)
              ? icon
              : React.createElement(icon as React.ElementType, {
                  size: iconSize,
                  className: clsx(active ? 'fill-current' : 'hover:fill-current'),
                })
          ) : isLogo && logoSrc ? (
            <Image src={logoSrc} alt={logoAlt} width={logoSize} height={logoSize} />
          ) : (
            children
          )}
        </Link>
      )
    }

    return (
      <button
        ref={ref}
        className={classes}
        disabled={disabled}
        onClick={onClick}
        {...rest}
      >
        {isIcon && icon ? (
          React.isValidElement(icon)
            ? icon
            : React.createElement(icon as React.ElementType, {
                size: iconSize,
                className: clsx(active ? 'fill-current' : 'hover:fill-current'),
              })
        ) : isLogo && logoSrc ? (
          <Image src={logoSrc} alt={logoAlt} width={logoSize} height={logoSize} />
        ) : (
          children
        )}
      </button>
    )
  },
)
Button.displayName = 'Button'

/* ----- ThemeToggle ----- */
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

interface FollowButtonProps {
  targetUsername: string;
  initialFollowing?: boolean;
  onToggle?: (nowFollowing: boolean) => void;
  size?: ButtonSize;
  variant?: ButtonVariant;
  className?: string;
  children?: React.ReactNode;
}

export function FollowButton({ 
  targetUsername, 
  initialFollowing = false, 
  onToggle, 
  size,
  className,
  variant,
  children
}: FollowButtonProps) {
  const { following, toggleFollow: toggleRaw, loading, loggedIn } = useFollow(
    targetUsername, 
    initialFollowing
  );
  const [hover, setHover] = useState(false);

  const handleToggle = async () => {
    const newFollowing = !following;
    await toggleRaw();
    onToggle?.(newFollowing);
  };

  const label = following
    ? (hover ? 'Deixar de seguir' : 'Seguindo')
    : 'Seguir';

  return (
    <Button
      size={size}
      onClick={handleToggle}
      disabled={!loggedIn || loading}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      variant={variant}
      className={className}
    >
      <Users size={16}/> {label}
    </Button>
  );
}


/** EditProfileButton */
export function EditProfileButton(props: ButtonProps) {
  return (
    <Button variant="default" size="sm" {...props}>
      Editar Perfil
    </Button>
  )
}

export function LogoButton() {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  if (!mounted) return null;

  const logoSrc =
    resolvedTheme === 'light'
      ? "/assets/icons/light/main_logo.svg"
      : "/assets/icons/dark/main_logo.svg";

  return (
    <Button
      variant="logo"
      logoSrc={logoSrc}
      logoAlt="Logo do site"
      logoSize={140}
      className="mb-2 self-start"
      href="/"
      aria-label="Logo do site"
    />
  )
}

export function IconButton({ icon: Icon, ...props }: { icon: React.ElementType; size?: number } & Omit<ButtonProps, 'icon'>) {
  return <Button variant="icon" icon={Icon} {...props} />
}
