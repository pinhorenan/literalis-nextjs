// File: src/components/post/NewPostModal.tsx
'use client';

import { useState } from 'react';
import { Dialog } from '@headlessui/react';
import { Button } from '@components/ui/Buttons';
import NewPostForm from '@components/post/NewPostForm';

export default function NewPostModal() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button onClick={() => setOpen(true)} className="mb-4">
        + Novo Post
      </Button>

      <Dialog open={open} onClose={() => setOpen(false)} className="relative z-50">
        <div className="fixed inset-0 bg-black/40" aria-hidden="true" />
        <div className="fixed inset-0 flex items-center justify-center p-4">
          <Dialog.Panel as="div" className="w-full max-w-3xl rounded-md bg-[var(--surface-bg)] p-6 border border-[var(--border-base)] shadow-lg overflow-y-auto max-h-[90vh]">
            <Dialog.Title as="h2" className="text-lg font-bold mb-4">Novo Post</Dialog.Title>
            <NewPostForm onClose={() => setOpen(false)} />
          </Dialog.Panel>
        </div>
      </Dialog>
    </>
  );
}
