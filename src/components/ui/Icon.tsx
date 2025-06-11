// components/ui/Icon.tsx
'use client';

import { useTheme } from 'next-themes';
import Image, { ImageProps } from 'next/image';
import { useEffect, useState } from 'react';

type IconName = 'search' | 'user' | 'friends' | 'explore' | 'settings' | 'bell' | 'message' | 'plus' | 'logo' | 'comment' | 'like' | 'book' | 'bookmark' | 'shelf';

interface IconProps extends Omit<ImageProps, 'src'> {
    name: IconName;
    basePath?: string;
}

export function Icon({ name, basePath = '/assets/icons', alt, ...imgProps }: IconProps) {
    const { theme, systemTheme } = useTheme();
    const [mounted, setMounted] = useState(false);

    // evita mismatch ssr/ssr e undefined theme
    useEffect(() => { setMounted(true); }, []);
    if (!mounted) return null;

    const currentTheme = theme === 'system' ? systemTheme : theme;

    const src = `${basePath}/${currentTheme}/${name}.svg`;

    return <Image src={src} alt={alt ?? name} {...imgProps} />;
} // WIP