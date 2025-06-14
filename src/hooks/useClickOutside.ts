// File: src/hooks/useClickOutside.ts
import { useEffect, RefObject } from 'react';

/**
 * Detecta clique fora de um elemento e chama o callback.
 * @param ref - Referência para o elemento-alvo
 * @param callback - Função chamada ao clicar fora
 */
export function useClickOutside(
  ref: RefObject<HTMLElement | null>,
  callback: () => void
) {
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        callback();
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [ref, callback]);
}
