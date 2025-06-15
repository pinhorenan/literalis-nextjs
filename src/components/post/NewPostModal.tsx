// File: src/components/post/NewPostModal.tsx
'use client';

import { Dialog }   from '@headlessui/react';
import NewPostForm  from '@components/post/NewPostForm';


interface NewPostModalProps {
  open: boolean;
  onClose: () => void;
}

export default function NewPostModal({ open, onClose }: NewPostModalProps) {  
  return (
    <>
      <Dialog open={open} onClose={onClose} className="relative z-50">
        <div className="fixed inset-0 bg-black/40" aria-hidden="true" />
        <div className="fixed inset-0 flex items-center justify-center p-4">
          <Dialog.Panel 
            as="div" 
            className="w-full max-w-3xl rounded-md bg-[var(--surface-bg)] p-6 border border-[var(--border-base)] shadow-lg overflow-y-auto max-h-[90vh]"
          >
            <Dialog.Title as="h2" className="text-lg font-bold mb-4">
              Novo Post
            </Dialog.Title>
            <NewPostForm onClose={onClose} />
          </Dialog.Panel>
        </div>
      </Dialog>
    </>
  );
}
