// File: src/app/page.tsx 

import Image from 'next/image';
import React from 'react';
import Link  from 'next/link';
import { Button, ThemeToggle } from '@components/ui/Buttons';

export default function Home() {
  return (
    <main className="flex flex-col items-center justify-center min-h-screen">
      <section className="container mx-auto px-6 py-16 flex lg:flwx-row items-center gap-12">
        
        {/* Texto e botões */}
        <div className="max-w-lg space-y-6 text-center lg:text-left">
          <h1 className="text-4x1 lg:text-5x1 font-bold text-[var-(--text-primary)]">
            Bem-vindo ao Literalis
          </h1>
          <p className="text-lg text-[--text-secondary]">
            Conecte-se com outros leitores, compartilhe suas leituras e descubra novos livros.
          </p>
          <div className="flex flex-col sm:flex-row items-left justify-center gap-4">
            <Link href="/feed">
              <Button variant="default" size="lg">Feed</Button>
            </Link>
            <Link href="/signin">
              <Button variant="default" size="lg">Entrar</Button>
            </Link>
            <Link href="/signup">
              <Button variant="default" size="lg">Cadastrar</Button>
            </Link>
            <ThemeToggle />
          </div>
        </div>

        <div className="relative w-full max-w-md">
          <Image
            src="/assets/images/reading_circle.png"
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