'use client';

import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter, useSearchParams } from 'next/navigation';

export default function LoginPage() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const router = useRouter();
    const params = useSearchParams();
    const callbackUrl = params.get('callbackUrl') || '/';

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        const res = await signIn('credentials', {
            redirect: false,
            username,
            password,
            callbackUrl,
        });
        if (res?.error) {
            setError('Usuário ou senha inválidos');
        } else {
            router.push(callbackUrl);
        }
    }

    return (
        <div className="max-w-md mx-auto mt-20 p-6 border rounded">
            <h1 className="text-2x1 mb-4">Entrar</h1>
            {error && <p className="text-red-600 mb-2">{error}</p>}
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label>Username</label>
                    <input
                        value={username}
                        onChange={e => setUsername(e.target.value)}
                        className="w-full border p-2 rounded"
                    />
                </div>
                <div>
                    <label>Senha</label>
                    <input
                        type="password"
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                        className="w-full border p-2 rounded"
                    />
                </div>
                <button type="submit" className="w-full py-2 bg-blue-600 text-white rounded">
                    Entrar
                </button>
            </form>
            <p className="mt-4 text-sm">
                Não tem conta?{' '}
                <a href="/signup" className="text-blue-600 underline">
                    Cadastrar-se
                </a>
            </p>
        </div>
    );
}