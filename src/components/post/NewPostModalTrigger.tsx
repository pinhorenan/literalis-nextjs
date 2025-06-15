// File: src/components/post/NewPostModalTrigger.tsx
'use client';

import { useState } from 'react';
import { BookPlus } from 'lucide-react';
import { Button   } from '@components/ui/Buttons';
import NewPostModal from '@components/post/NewPostModal'

export default function NewPostModalTrigger() {
    const [open, setOpen] = useState(false);

    return (
        <>
            <Button
                onClick={() => setOpen(true)}
                iconSize={30}
                variant="default"
                className="bg-transparent hover:bg-[var(--surface-card-hover)] gap-3 rounded-lg border-none"
            >
                <BookPlus />
                <strong className="text-lg text-[var(--text-secondary)]">Publicar</strong>
            </Button>

            {open && <NewPostModal open={open} onClose={() => setOpen(false)} />}
        </>
    )
}