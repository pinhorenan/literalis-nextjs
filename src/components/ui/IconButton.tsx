import { LucideIcon } from 'lucide-react';

interface IconButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  icon: LucideIcon;
  size?: number;
}

export function IconButton({ icon: Icon, size = 24, ...rest }: IconButtonProps) {
  return (
    <button {...rest} className={`p-1 inline-flex items-center justify-center ${rest.className ?? ''}`}>
      <Icon size={size} />
    </button>
  );
}
