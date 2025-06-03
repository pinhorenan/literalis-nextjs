'use client';

import { signIn } from 'next-auth/react';
import { useState } from 'react';
import Link from 'next/link';

export default function SignInPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const res = await signIn('credentials', {
            redirect: false,
            email,
            password,
        });
        if (res?.error) {
            alert('Erro ao fazer login: ' + res.error);
        } else {
            window.location.href = '/feed'; // Redireciona para a página de feed após login
        }
    };

    return (
        <main className="flex flex-col items-center justify-center min-h-screen p-4">
            <h1 className="text-2x1 mb-4">Entrar</h1>
            <form onSubmit={handleSubmit} className="flex flex-col gap-4 w-full max-w-sm">
                <input 
                    type="email"
                    placeholder="seu@email.com" 
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    className="border px-2 py-1 rounded"
                    required
                />
                <input
                    type="password"
                    placeholder="Senha"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    className="border px-2 py-1 rounded"
                    required 
                />
                <button type="submit" className="bg-[var(--olive)] text-white px-4 py-2 rounded">
                    Entrar
                </button>
            </form>
            <p className="mt-4">
                Ainda não tem conta? {' '}
                <Link href="/auth/signup" className="text-[var(--olive)] underline">
                    Cadastre-se
                </Link>
            </p>
            <hr className="my-6 w-full max-w-sm" />
            <button
                onClick={() => signIn('github')}
                className="bg-gray-800 text-white px-4 py-2 rounded"
            >
                Entrar com GitHub
            </button>
        </main>
    );
}