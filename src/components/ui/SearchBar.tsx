// components/ui/SearchBar.tsx
"use client";

import { FormEvent, useEffect, useState } from "react";
import { Button } from "@components/ui/Buttons";
import { Search } from "lucide-react";

interface Props {
  value: string;
  onChange: (v: string) => void;
  onSearch: () => void;
};

export function SearchBar({ value, onChange, onSearch }: Props) {
  const handleSubmit = (e: FormEvent) => { e.preventDefault(); onSearch(); };

  return (
    <form onSubmit={handleSubmit} className="relative w-full max-w-md">
      <input
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder="Pesquisar..."
        className="
          w-full h-10 pl-4 pr-10 rounded
          bg-[var(--surface-input)]
          border border-[var(--border-subtle)]
          text-[var(--text-primary)]
          focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]
        "
      />
      <Button
        variant="icon"
        icon={Search}
        type="submit"
        className="absolute right-2 top-1/2 -translate-y-1/2 opacitiy-60"
        aria-label="Pesquisar"
      />
    </form>
  )
}