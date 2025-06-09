import Image from 'next/image';
import Link from 'next/link';
import React from 'react';
import { Button } from '@/src/components/ui/Buttons';

export default function Home() {
  return (
    <main className="flex flex-col items-center justify-center min-h-screen">
      <section className="container mx-auto px-6 py-16 flex flex-col lg:flwx-row items-center gap-12">
        { /* Bloco de texto e CTA */}
        <div className="max-w-lg space-y-6 text-center lg:text-left">
          <h1 className="text-4x1 lg:text-5x1 font-bold text-[var-(--text-primary)]">
            Bem-vindo ao Literalis
          </h1>
          <p className="text-lg text-[--text-secondary]">
            Conecte-se com outros leitores, compartilhe suas leituras e descubra novos livros.
          </p>
          <Link href="/feed">
            <Button variant="default" size="lg">Acessar Feed</Button>
          </Link>
        </div>

        {/* Ilustração */}
        <div className="relative w-full max-w-md">
          <Image
            src="/assets/images/landing-illustration.svg"
            alt="Ilustração de boas-vindas ao Literalis"
            width={500}
            height={500}
            className="w-full h-auto"
          />
        </div>
      </section>
    </main>
  )
}