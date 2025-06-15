// File: src/components/search/SearchTab.tsx

interface SearchTabsProps {
    selected: 'books' | 'users';
    onSelect: (tab: 'books' | 'users') => void;
}

export default function SearchTabs({ selected, onSelect }: SearchTabsProps) {
    return (
        <div className="flex gap-4 border-b border-[var(--border-base)]">
            {['books', 'users'].map((type) => (
                <button
                    key={type}
                    onClick={() => onSelect(type as any)}
                    className={`pb-2 twxt-sm font-medium ${
                        selected === type ? 'border-b-2 border-[var(--color-primary)]' : 'text-[var(--text-secondary)]'
                    }`}
                >
                    {type === 'books' ? 'Livros' : 'Usuários'}
                </button>
            ))}
        </div>
    );
}