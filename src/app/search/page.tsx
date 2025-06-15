// File: src/app/search/page.tsx
'use client';

import { useState }     from 'react';
import useDebounce      from '@hooks/useDebounce';
import SearchBar        from '@components/ui/SearchBar';
import SearchTabs       from '@components/search/SearchTabs';
import SearchResults    from '@components/search/SearchResults';

export default function SearchPage() {
    const [query, setQuery] = useState('');
    const [tab, setTab] = useState<'books' | 'users'>('books');
    const debouncedQuery = useDebounce(query, 300);

    return (
        <section className="max-w-4xl mx-auto px-4 py-6 space-y-4">
            <SearchBar value={query} onChange={setQuery} />

            <SearchTabs selected={tab} onSelect={setTab} />

            <SearchResults query={debouncedQuery} tab={tab} />
        </section>
    );
}