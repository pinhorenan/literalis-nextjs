// src/lib/relativeTime.ts
const MINUTE = 60_000;
const HOUR   = 60 * MINUTE;
const DAY    = 24 * HOUR;

export function relativeTime(isoDate: string): string {
  const diff = Date.now() - new Date(isoDate).getTime();

  if (diff < MINUTE)                 return 'agora mesmo';
  if (diff < HOUR)                   return `há ${Math.floor(diff / MINUTE)} min`;
  if (diff < DAY)                    return `há ${Math.floor(diff / HOUR)} h`;
  if (diff < 2 * DAY)                return 'ontem';
  if (diff < 30 * DAY)               return `há ${Math.floor(diff / DAY)} dias`;

  const d = new Date(isoDate);
  return d.toLocaleDateString('pt-BR');
}
