import { FooterLinks } from '@/src/components/layout/FooterLinks';

export function Footer() {
  return (
    <footer className="flex flex-col items-center justify-center z-[100] py-10 px-4 md:px-80 bg-[var(--olive)] text-white">
      <div className="flex items-center justify-between w-full">
        <FooterLinks />
        <p className="text-lg font-serif m-0">
          © {new Date().getFullYear()} Literalis — todos os direitos reservados.
        </p>
      </div>
    </footer>
  );
}
