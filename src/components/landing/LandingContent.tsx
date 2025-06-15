// File: src/components/landing/LandingContent.tsx
'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { Sparkles } from 'lucide-react';
import { Button, ThemeToggle } from '@components/ui/Buttons';
import { CircleVector } from '@components/svg/Circle';
import { Logo } from '@components/svg/Logo';

export default function LandingContent() {
  return (
    <motion.section
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
      className="relative isolate min-h-screen overflow-hidden bg-gradient-to-b from-[var(--surface-bg)] to-[var(--surface-alt)] px-6 py-16 lg:px-24 flex flex-col-reverse lg:flex-row items-center justify-evenly gap-12"
    >
    {/* — Botões fixos no topo — */}
      <div className="absolute top-4 right-6 flex items-center gap-2 z-20">
        <ThemeToggle />
        <Link href="/signin">
          <Button variant="ghost" className="text-sm hover:underline text-[var(--text-primary)]">
            Entrar
          </Button>
        </Link>
      </div>  

      {/* — Fundo texturizado — */}
      <Image
        src="/assets/decor/paper-texture.png"
        alt=""
        fill
        className={`absolute inset-0 object-cover opacity-40 pointer-events-none z-0`}
      />

      {/* - Círculos de fundo - */}
      <CircleVector className="
        absolute -bottom-32 -left-32 z-10 
        w-[300px] md:w-[400px] lg:w-[500px] 
        h-[300px] md:h-[400px] lg:h-[500px] 
        " 
       />
      <CircleVector className="
        absolute -top-32 right-0 z-10 
        w-[240px] md:w-[320px] lg:w-[480px] 
        h-[240px] md:h-[320px] lg:h-[480px]
        " 
       />

      {/* — Bloco de Texto — */}
      <div className="max-w-xl space-y-6 text-left relative z-10">

        {/* — Logo + Nome — */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.4 }}
          className="flex items-center gap-3"
        >
          <Logo className="w-15 h-15" />
          <h1 className="text-2xl font-bold text-[var(--text-primary)]">Literalis</h1>
        </motion.div>

        {/* - Selo de destaque */}
        <motion.div
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3, duration: 0.4 }}
          className="inline-flex items-center gap-2 text-sm font-medium bg-muted px-3 py-1 rounded-full w-fit text-[var(--text-primary)] mt-2"
        >
          <Sparkles size={16} /> Nova rede social literária
        </motion.div>

        {/* - Headline animada com destaque */}
        <motion.h1
          className="text-4xl font-bold tracking-tight sm:text-5xl leading-tight text-[var(--text-primary)] space-y-1"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.6 }}
        >
          <div>Conecte leitores.</div>
          <div>Descubra livros.</div>
          <div className="relative inline-block">
            <motion.span
              initial={{ backgroundSize: '0% 100%' }}
              animate={{ backgroundSize: '100% 100%' }}
              transition={{ delay: 0.9, duration: 0.8, ease: 'easeOut' }}
              className="relative z-10 bg-[linear-gradient(120deg,var(--surface-alt)_0%,var(--surface-alt)_100%)] bg-no-repeat bg-left-bottom bg-[length:0%_0.25rem]"
            >
              Compartilhe histórias.
            </motion.span>
          </div>
        </motion.h1>

        {/* - Descrição - */}
        <motion.p
          className="text-muted-foreground text-lg max-w-prose"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2, duration: 0.6 }}
        >
          Na Literalis, você acompanha leituras de amigos, mantém sua estante virtual e descobre obras incríveis.
        </motion.p>

        {/* - Botões - */}
        <motion.div
          className="flex flex-col sm:flex-row gap-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.5, duration: 0.6 }}
        >
          <Link href="/signup">
            <Button
              size="lg"
              className="rounded-xl border-[var(--border-base)] bg-[var(--surface-card)] hover:bg-[var(--surface-card-hover)]"
            >
              Crie sua conta
            </Button>
          </Link>
        </motion.div>
      </div>

      {/* — Ilustração redonda — */}
      <motion.div
        className="hidden lg:block w-full max-w-sm aspect-square overflow-hidden rounded-full border border-[var(--border-base)] shadow-md z-10"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 1.0, duration: 0.6 }}
      >
        <Image
          src="/assets/images/reading_circle.png"
          alt="Ilustração de boas-vindas"
          width={400}
          height={400}
          className="object-cover w-full h-full"
        />
      </motion.div>
    </motion.section>
  );
}
