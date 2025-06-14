// File: src/app/signup/page.tsx

import { SignUpForm } from '@components/auth/SignUpForm';

export default function SignUpPage() {
  return (
    <div className="max-w-md mx-auto mt-24 p-6 border rounded-lg bg-[var(--surface-alt)] shadow-lg">
      <h1 className="text-3xl font-bold mb-6 text-center">Cadastrar-se</h1>
      <SignUpForm />
    </div>
  );
}
