'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import bcrypt from 'bcrypt';

export default function SignUpPage() {
    const [email, setEmail] = useState('');
    const [name, setName] = useState('');
    const [password, setPassword] = useState('');
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        const hashed = await bcrypt.hash(password, 10);
        const resp = await fetch('/api/auth/signup', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, name, password: hashed }),
        });
        if (!resp.ok) {
            alert('Falha no cadastro');
            return;
        }
        router.push('/auth/signin');
    };

    return (
        <main className="flex flex-col items-center justify-center min-h-screen p-4">
          <h1 className="text-2xl mb-4">Cadastrar</h1>
          <form onSubmit={handleSubmit} className="flex flex-col gap-4 w-full max-w-sm">
            <input
              type="text"
              placeholder="Nome completo"
              value={name}
              onChange={e => setName(e.target.value)}
              className="border px-2 py-1 rounded"
              required
            />
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
              Cadastrar
            </button>
          </form>
        </main>
    );
}