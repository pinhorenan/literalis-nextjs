// app/theme-provider.tsx
'use client';
import { ReactNode } from 'react';
import { ThemeProvider as NextThemes } from 'next-themes';

interface ThemeProviderProps {
    children: ReactNode;
    attribute?: "class" | "data-theme";
    defaultTheme?: string;
    enableSystem?: boolean;
    disableTransitionOnChange?: boolean;
}

export default function ThemeProvider({
    children,
    attribute = "class",
    defaultTheme = "system",
    enableSystem = true,
    disableTransitionOnChange = false,
}: ThemeProviderProps) {
    return (
        <NextThemes
            attribute={attribute}
            defaultTheme={defaultTheme}
            enableSystem={enableSystem}
            disableTransitionOnChange={disableTransitionOnChange}
        >
            {children}
        </NextThemes>
    );
}