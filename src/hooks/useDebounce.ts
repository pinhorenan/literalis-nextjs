// File: src/hooks/useDebounce.ts
'use client';

import { useState, useEffect } from 'react';

/**
 * Retorna um valor que é atualizado apenas após o tempo de espera (`delay`) desde a última alteração.
 * Ideal para otimizar buscas em tempo real.
 *
 * @param value Valor que será "esperado"
 * @param delay Tempo em milissegundos antes de atualizar o valor retornado
 */
export default function useDebounce<T>(value: T, delay: number): T {
  const [debounced, setDebounced] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebounced(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debounced;
}
