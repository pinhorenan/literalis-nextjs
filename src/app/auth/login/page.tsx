// app/auth/login/page.tsx
'use client';

import { useState, FormEvent } from 'react';
import { signIn }               from 'next-auth/react';
import { useRouter }            from 'next/navigation';
import Link                     from 'next/link';
import { Button }               from '@components/ui/Buttons';

export default function LoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error,    setError]    = useState('');

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError('');

    const res = await signIn('credentials', {
      redirect: false,
      username,
      password,
      callbackUrl: '/feed',
    });

    if (res?.error) {
      setError('Usuário ou senha inválidos.');
      return;
    }

    router.push(res?.url ?? '/feed');
  }

  return (
    <div className="max-w-md mx-auto mt-24 p-6 border rounded-lg bg-[var(--surface-alt)] shadow-lg">
      <h1 className="text-3xl font-bold mb-6 text-center">Entrar</h1>

      {error && (
        <div className="mb-4 px-3 py-2 bg-red-100 text-red-700 rounded">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="username" className="block mb-1 font-medium">
            Usuário
          </label>
          <input
            id="username"
            name="username"
            type="text"
            value={username}
            onChange={e => setUsername(e.target.value)}
            className="w-full border border-[var(--border-base)] p-2 rounded"
            required
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
            value={password}
            onChange={e => setPassword(e.target.value)}
            className="w-full border border-[var(--border-base)] p-2 rounded"
            required
          />
        </div>

        <Button
          type="submit"
          variant="default"
          size="md"
          className="w-full"
        >
          Entrar
        </Button>
      </form>

      <p className="mt-6 text-center text-sm">
        Não tem conta?{' '}
        <Link href="/auth/register" passHref>
          <Button variant="default" size="sm">
            Cadastrar-se
          </Button>
        </Link>
      </p>
    </div>
  );
}
