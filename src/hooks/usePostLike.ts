// hook/usePostLike.ts
'use client';

import { useCallback, useState } from 'react';

interface UsePostLikeReturn {
    liked: boolean;
    likeCount: number;
    loading: boolean;
    toggleLike: () => Promise<void>;
}

