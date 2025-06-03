"use client"

import { FormEvent, useEffect, useState } from "react"
import { IconButton }      from "@/src/components/ui/IconButton"
import { Search }          from "lucide-react"
import { useRouter }       from "next/navigation"

interface BookItem {
  id: string
  volumeInfo: {
    title: string
    authors?: string[]
    imageLinks?: { thumbnail: string }
  }
}

interface SearchBarProps {
  value: string
  onChange: (v: string) => void
  onSearch: () => void
}

// Debounce interno
function useDebounce<T>(value: T, delay = 300): T {
  const [debounced, setDebounced] = useState<T>(value)
  useEffect(() => {
    const h = setTimeout(() => setDebounced(value), delay)
    return () => clearTimeout(h)
  }, [value, delay])
  return debounced
}

export function SearchBar({ value, onChange, onSearch }: SearchBarProps) {
  const [suggestions, setSuggestions] = useState<BookItem[]>([])
  const debouncedValue = useDebounce(value, 300)
  const router = useRouter()

  useEffect(() => {
    console.log("🔎 debouncedValue mudou:", debouncedValue)
    if (!debouncedValue.trim()) {
      setSuggestions([])
      return
    }
    const url = new URL("https://www.googleapis.com/books/v1/volumes")
    url.searchParams.set("q", debouncedValue)
    url.searchParams.set("maxResults", "5")
    // Se tiver API key no .env.local
    const key = process.env.NEXT_PUBLIC_GOOGLE_BOOKS_API_KEY
    if (key) url.searchParams.set("key", key)

    console.log("➡️ Fetching:", url.toString())
    fetch(url.toString())
      .then(res => res.json())
      .then(data => {
        console.log("📚 Sugestões recebidas:", data.items)
        setSuggestions(data.items || [])
      })
      .catch(err => {
        console.error("❌ Erro no fetch:", err)
        setSuggestions([])
      })
  }, [debouncedValue])

  const handleSelect = (q: string) => {
    onChange(q)
    setSuggestions([])
    router.push(`/search/${encodeURIComponent(q)}`)
  }

  return (
    <div className="relative w-full max-w-md">
      <form
        onSubmit={(e: FormEvent) => {
          e.preventDefault()
          onSearch()
        }}
      >
        <input
          type="search"
          value={value}
          onChange={e => onChange(e.target.value)}
          className="w-full h-12 pl-4 pr-10 border rounded-md focus:outline-none bg-white"
          placeholder="Pesquisar…"
          autoComplete="off"
        />
        <IconButton
          icon={Search}
          type="submit"
          className="absolute right-1 top-1/2 -translate-y-1/2 opacity-60"
          aria-label="Pesquisar"
        />
      </form>

      {suggestions.length > 0 && (
        <ul
          className="
            absolute top-full left-0 right-0 mt-1 w-full
            max-h-60 overflow-auto
            rounded-md bg-white shadow-lg
            ring-1 ring-black ring-opacity-5
            z-[9999]
          "
        >
          {suggestions.map(book => (
            <li
              key={book.id}
              className="flex items-center gap-2 px-4 py-2 hover:bg-gray-100 cursor-pointer"
              onClick={() => handleSelect(book.volumeInfo.title)}
            >
              {book.volumeInfo.imageLinks?.thumbnail && (
                <img
                  src={book.volumeInfo.imageLinks.thumbnail}
                  alt={book.volumeInfo.title}
                  className="w-8 h-10 object-cover"
                />
              )}
              <div className="flex-1">
                <p className="text-sm font-medium">{book.volumeInfo.title}</p>
                {book.volumeInfo.authors && (
                  <p className="text-xs text-gray-500">
                    {book.volumeInfo.authors.join(", ")}
                  </p>
                )}
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
