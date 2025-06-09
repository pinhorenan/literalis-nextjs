// app/auth/register/page.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function SignUpPage() {
  const [form, setForm] = useState({
    username: "",
    name: "",
    email: "",
    password: "",
  });
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  function onChange(e: React.ChangeEvent<HTMLInputElement>) {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    const res = await fetch("/api/auth/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    const data = await res.json();

    if (!res.ok) {
      // zod → errors[], fallback → error
      const msg =
        data?.errors?.[0]?.message ??
        data?.error ??
        "Erro ao cadastrar.";
      setError(msg);
      return;
    }

    router.push("/login");
  }

  return (
    <div className="max-w-md mx-auto mt-20 p-6 border rounded">
      <h1 className="text-2xl mb-4">Cadastrar-se</h1>

      {error && <p className="text-red-600 mb-2">{error}</p>}

      <form onSubmit={handleSubmit} className="space-y-4">
        {[
          { name: "username", label: "Username" },
          { name: "name", label: "Nome" },
          { name: "email", label: "E-mail" },
          { name: "password", label: "Senha" },
        ].map(field => (
          <div key={field.name}>
            <label className="block mb-1">{field.label}</label>
            <input
              name={field.name}
              type={field.name === "password" ? "password" : "text"}
              value={(form as any)[field.name]}
              onChange={onChange}
              className="w-full border p-2 rounded"
              minLength={field.name === "password" ? 6 : undefined}
              required={field.name !== "email"} // e-mail é opcional
            />
          </div>
        ))}

        <button
          type="submit"
          className="w-full py-2 bg-green-600 text-white rounded"
        >
          Cadastrar
        </button>
      </form>

      <p className="mt-4 text-sm">
        Já tem conta?{" "}
        <a href="/login" className="text-blue-600 underline">
          Entrar
        </a>
      </p>
    </div>
  );
}
