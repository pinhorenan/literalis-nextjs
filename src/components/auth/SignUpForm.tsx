// File: src/components/auth/SignUpForm.tsx
'use client';

import { useState, useRef, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@components/ui/Buttons';

interface SignUpFormProps {
  redirectTo?: string;
  compact?: boolean;
  onSuccess?: () => void;
}

// ? considerar a opção e fazer o upload do avatar, abrindo explorador de arquivos
// ? considerar redirecionamento para página de boas vindas com configurações iniciais e coleta de dados adicionais
// ? na página de boas vindas, considerar a opção de seguir usuários populares ou amigos, assim como adicionar livros que tem interesse, gerando dados para futuras *recomendações personalizadas*
export default function SignUpForm({
  redirectTo = '/signin',
  compact = false,
  onSuccess,
}: SignUpFormProps) {
  const router = useRouter();
  const errorRef = useRef<HTMLDivElement>(null);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState({
    username: '',
    name: '',
    email: '',
    password: '',
    avatarPath: '',
    bio: '',
  });

  function onChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
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
      setTimeout(() => errorRef.current?.focus(), 0);
      return;
    }

    onSuccess ? onSuccess() : router.push(redirectTo);
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4" noValidate>
      <fieldset className="space-y-4">
        <legend className="sr-only">Cadastro</legend>

        {error && (
          <div
            ref={errorRef}
            id="signup-error"
            role="alert"
            tabIndex={-1}
            className="px-3 py-2 bg-red-100 text-red-700 rounded text-sm"
            aria-live="assertive"
          >
            {error}
          </div>
        )}

        <div>
          <label htmlFor="username" className="block mb-1 font-medium">Usuário</label>
          <input
            id="username"
            name="username"
            type="text"
            value={form.username}
            onChange={onChange}
            required
            aria-required="true"
            className="w-full border border-[var(--border-base)] p-2 rounded"
          />
        </div>

        <div>
          <label htmlFor="name" className="block mb-1 font-medium">Nome</label>
          <input
            id="name"
            name="name"
            type="text"
            value={form.name}
            onChange={onChange}
            required
            aria-required="true"
            className="w-full border border-[var(--border-base)] p-2 rounded"
          />
        </div>

        <div>
          <label htmlFor="email" className="block mb-1 font-medium">E-mail</label>
          <input
            id="email"
            name="email"
            type="email"
            value={form.email}
            onChange={onChange}
            className="w-full border border-[var(--border-base)] p-2 rounded"
          />
        </div>

        <div>
          <label htmlFor="password" className="block mb-1 font-medium">Senha</label>
          <input
            id="password"
            name="password"
            type="password"
            value={form.password}
            onChange={onChange}
            minLength={6}
            required
            aria-required="true"
            className="w-full border border-[var(--border-base)] p-2 rounded"
          />
        </div>

        <div>
          <label htmlFor="avatarPath" className="block mb-1 font-medium">URL do Avatar (opcional)</label>
          <input
            id="avatarPath"
            name="avatarPath"
            type="url"
            value={form.avatarPath}
            onChange={onChange}
            className="w-full border border-[var(--border-base)] p-2 rounded"
          />
        </div>

        <div>
          <label htmlFor="bio" className="block mb-1 font-medium">Biografia (opcional)</label>
          <textarea
            id="bio"
            name="bio"
            value={form.bio}
            onChange={onChange}
            rows={3}
            className="w-full border border-[var(--border-base)] p-2 rounded"
          />
        </div>
      </fieldset>

      <Button type="submit" variant="default" size="md" className="w-full">
        Cadastrar
      </Button>

      {!compact && (
        <p className="text-center text-sm mt-4">
          Já tem conta?{' '}
          <a href="/auth/login" className="underline text-[var(--text-link)]">
            Entrar
          </a>
        </p>
      )}
    </form>
  );
}
