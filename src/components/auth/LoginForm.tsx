// File src/components/auth/LoginForm.tsx
'use client';

import { useState, useRef, FormEvent } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@components/ui/Buttons';

interface LoginFormProps {
    redirectTo?: string;
    onSuccess?: () => void;
    compact?: boolean;
}

export function LoginForm({
    redirectTo = '/feed',
    onSuccess,
    compact = false,
}: LoginFormProps) {
    const router = useRouter();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const errorRef = useRef<HTMLDivElement>(null);
    const [error, setError] = useState('');

    async function handleSubmit(e: FormEvent) {
        e.preventDefault();
        setError('');

        const res = await signIn('credentials', {
            redirect: false,
            username,
            password,
            callbackUrl: redirectTo,
        });

        if (res?.error) {
            setError('Usuário ou senha inválidos.');
            setTimeout(() => errorRef.current?.focus(), 0);
            return;
        }

        onSuccess ? onSuccess() : router.push(res?.url ?? redirectTo);
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-4" noValidate>
            <fieldset className="space-y-4">
                <legend className="sr-only">Acesso à conta</legend>

                {error && (
                    <div 
                        ref={errorRef}
                        role="alert"
                        tabIndex={-1}
                        className="px-3 py-2 bg-red-100 text-red-700 rounded text-sm"
                        aria-live="assertive"
                    >
                        {error}
                    </div>
                )}

                <div>
                    <label htmlFor="username" className="block mb-1 font-medium">
                        Usuário
                    </label>
                    <input 
                        id="username"
                        name="username"
                        type="text" 
                        autoComplete="username"
                        value={username}
                        onChange={e => setUsername(e.target.value)}
                        required
                        aria-required="true"
                        aria-invalid={!!error}
                        aria-describedby={error ? 'login-error' : undefined}
                        className="w-full border border-[var(--border-base)] p-2 rounded"
                    />
                </div>

                <div>
                    <label htmlFor="password" className="block mb-1 font-medium">
                        Senha
                    </label>
                    <input 
                        id="password"
                        name="password"
                        type="password" 
                        autoComplete="current-password"
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                        required
                        aria-required="true"
                        aria-invalid={!!error}
                        className="w-full border border-[var(--border-base)] p-2 rounded"
                    />
                </div>
            </fieldset>
            
            <Button type="submit" variant="default" size="md" className="w-full">
                Entrar
            </Button>

            {!compact && (
                <div className="text-center text-sm">
                    <span>Não tem conta? </span>
                    <Link href="/auth/register" className="underline text-[var(--text-link)]">
                        Cadastre-se
                    </Link>
                </div>
            )}
        </form>
    );
}