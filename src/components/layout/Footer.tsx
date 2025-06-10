// components/layout/Footer.tsx
import Link from 'next/link';

const items = [
  { href: '/about', label: 'Sobre nós' },
  { href: '/terms', label: 'Termos de uso' },
  { href: '/privacy', label: 'Política de privacidade' },
];

export default function Footer() {
  return (
    <footer className="
      sticky bottom-0 left-0 w-full
      bg-[var(--surface-alt)] text-[var(--text-secondary)]
      border-t border-[var(--border-base)]
      px-[var(--gap-md)] py-10 z-90
    "
    style={{ height: 'var(--size-footer)' }} 
    >
      <div className="container mx-auto flex flex-col md:flex-row gap-6 md:gap-0 justify-between items-center">
        <nav aria-label="Rodapé" className="flex gap-8">
          {items.map(({ href, label }) => (
            <Link key={href} href={href} className="hover:text-[var(--text-primary)]">
              {label}
            </Link>
          ))}
        </nav>
        <p className="text-sm">
          © {new Date().getFullYear()} Literalis — todos os direitos reservados.
        </p>
      </div>
    </footer>
  );
}
