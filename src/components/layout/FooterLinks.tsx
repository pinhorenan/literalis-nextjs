import Link from 'next/link';

const items = [
  { href: '/about', label: 'Sobre nós' },
  { href: '/terms', label: 'Termos de uso' },
  { href: '/privacy', label: 'Política de privacidade' },
];

export function FooterLinks() {
  return (
    <nav aria-label="Rodapé" className="flex gap-8">
      {items.map(({ href, label }) => (
        <Link key={href} href={href} className="text-lg font-serif">
          {label}
        </Link>
      ))}
    </nav>
  );
}
