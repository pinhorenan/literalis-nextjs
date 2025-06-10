// app/auth/register/page.tsx
'use client';

import { useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@components/ui/Buttons';

export default function SignUpPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    username: '',
    name: '',
    email: '',
    password: '',
  });
  const [error, setError] = useState<string | null>(null);

  function onChange(e: React.ChangeEvent<HTMLInputElement>) {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);

    const res = await fetch('/api/auth/signup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    });

    const data = await res.json();
    if (!res.ok) {
      const msg = data?.errors?.[0]?.message ?? data?.error ?? 'Erro ao cadastrar.';
      setError(msg);
      return;
    }

    // Cadastro bem-sucedido → redireciona para login
    router.push('/auth/login');
  }

  return (
    <div className="max-w-md mx-auto mt-24 p-6 border rounded-lg bg-[var(--surface-alt)] shadow-lg">
      <h1 className="text-3xl font-bold mb-6 text-center">Cadastrar-se</h1>

      {error && (
        <div className="mb-4 px-3 py-2 bg-red-100 text-red-700 rounded">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="username" className="block mb-1 font-medium">
            Username
          </label>
          <input
            id="username"
            name="username"
            type="text"
            value={form.username}
            onChange={onChange}
            className="w-full border border-[var(--border-base)] p-2 rounded"
            required
          />
        </div>

        <div>
          <label htmlFor="name" className="block mb-1 font-medium">
            Nome
          </label>
          <input
            id="name"
            name="name"
            type="text"
            value={form.name}
            onChange={onChange}
            className="w-full border border-[var(--border-base)] p-2 rounded"
            required
          />
        </div>

        <div>
          <label htmlFor="email" className="block mb-1 font-medium">
            E-mail
          </label>
          <input
            id="email"
            name="email"
            type="email"
            value={form.email}
            onChange={onChange}
            className="w-full border border-[var(--border-base)] p-2 rounded"
            // se quiser manter email opcional, comente a próxima linha
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
            value={form.password}
            onChange={onChange}
            className="w-full border border-[var(--border-base)] p-2 rounded"
            minLength={6}
            required
          />
        </div>

        <Button type="submit" variant="default" size="md" className="w-full">
          Cadastrar
        </Button>
      </form>

      <p className="mt-6 text-center text-sm">
        Já tem conta?{' '}
        <Link href="/auth/login" passHref>
          <Button variant="default" size="sm">
            Entrar
          </Button>
        </Link>
      </p>
    </div>
  );
}
