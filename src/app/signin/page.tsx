// File:  src/app//login/page.tsx

import { LoginForm } from '@components/auth/SignInForm';

export default function LoginPage() {
  return (
    <div className="max-w-md mx-auto mt-24 p-6 border rounded-lg bg-[var(--surface-alt)] shadow-lg">
      <h1 className="text-3x1 font-bold mb-6 text-center">Entrar</h1>
      <LoginForm />
    </div>
  );
}