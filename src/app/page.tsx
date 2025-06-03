import Link from 'next/link';
import React from 'react';

import { Button } from '@/src/components/ui/Button';

export default function Home() {
  return (
    <section className='border-1 border-[var(--olive)] h-screen mx-20 flex items-center justify-evenly'>

      <div className="border-1 border-[var(--olive)] flex flex-col items-center justify-center gap-8 text-center">
        <div className="flex flex-row items-center gap-4">
          <div>
            <img src="/assets/images/main_logo.svg" alt="Literalis" />
          </div>
        </div>
        <Link href="/feed/">
          <Button>
            Feed
          </Button>
        </Link>
      </div>

      <div className="border-1 border-[var(--olive)] relative flex flex-col w-auto h-auto items-center justify-center">
        <div className="">
          <img src="/assets/images/top_circle.png" alt="" />
        </div>
        <div className="absolute top-[-25] left-0 w-55 h-55">
          <img src="/assets/images/writing_circle.png" alt="Escrita" />
        </div>
        <div className="absolute bottom-0 right-0 w-60 h-60">
          <img src="/assets/images/reading_circle.png" alt="Leitura" />
        </div>
        <div className="">
          <img src="/assets/images/bottom_circle.png" alt="" />
          <div>Conheça (vertical) </div>
        </div>
      </div>
    </section>
  )
}
