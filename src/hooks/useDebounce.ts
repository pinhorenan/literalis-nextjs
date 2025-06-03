// src/hooks/useDebounce.ts
import { useState, useEffect } from 'react'

/**
 * Retorna uma versão “debounced” de `value`, que só muda após `delay` ms.
 */
export function useDebounce<T>(value: T, delay: number = 300): T {
  const [debounced, setDebounced] = useState<T>(value)

  useEffect(() => {
    const handler = setTimeout(() => setDebounced(value), delay)
    return () => clearTimeout(handler)
  }, [value, delay])

  return debounced
}
