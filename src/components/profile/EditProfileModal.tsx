// File: src/components/profile/EditProfileModal.tsx
'use client';

import { useState, useEffect, FormEvent } from 'react';
import { Button } from '@components/ui/Buttons';
import Image from 'next/image';

interface EditProfileModalProps {
    isOpen: boolean;
    onClose: () => void;
    user: {
        username: string;
        name: string;
        bio?: string;
        avatarPath: string;
    };
    onSave: (updated: { name: string; bio?: string; avatarPath: string }) => void;
}

export default function EditProfileModal({ isOpen, onClose, user, onSave }: EditProfileModalProps) {
    const [name, setName] = useState(user.name);
    const [bio, setBio] = useState(user.bio || '');
    const [avatarPath, setAvatarPath] = useState(user.avatarPath);

    useEffect(() => {
        if (isOpen) {
            setName(user.name);
            setBio(user.bio || '');
            setAvatarPath(user.avatarPath);
        }
    }, [isOpen, user]);

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        const res = await fetch(`/api/users/${user.username}`, {
            method: 'PATCH',
            credentials: 'include',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, bio, avatarPath }),
        });
        if (!res.ok) {
            return;
        }
        onSave({ name, bio, avatarPath });
        
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            <div
                className="absolute inset-0 bg-black/50"
                onClick={onClose}
            />
            <div className="relative bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-md">
                <h2 className="text-x1 font-semibold mb-4">Editar Perfil</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium">Nome</label>
                        <input
                            type="text" 
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="mt-1 w-full rounded border px-3 py-2 bg-white dark:bg-gray-700"
                            required    
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium">Bio</label>
                        <textarea
                            value={bio}
                            onChange={(e) => setBio(e.target.value)}
                            className="mt-1 w-full rounded border px-3 py-2 bg-white dark:bg-gray-700"
                            rows={3}
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium">Avatar URL</label>
                        <input
                            type="text"
                            value={avatarPath}
                            onChange={(e) => setAvatarPath(e.target.value)}
                            className="mt-1 w-full rounded border px-3 py-2 bg-white dark:bg-gray-700"
                        />
                        <div className="mt-2">
                            <Image
                                src={avatarPath}
                                alt="Preview"
                                width={64}
                                height={64}
                                className="rounded-full"
                            />
                        </div>
                    </div>
                    <div className="flex justify-end gap-2 mt-4">
                        <Button variant="default" onClick={onClose} type="button">
                            Cancelar
                        </Button>
                        <Button type="submit">Salvar</Button>
                    </div>
                </form>
            </div>
        </div>
    );
}