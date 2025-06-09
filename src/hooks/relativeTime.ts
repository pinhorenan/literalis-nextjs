// hooks/relativeTime.ts

const MINUTE = 60_000;
const HOUR   = 60 * MINUTE;
const DAY    = 24 * HOUR;

/**
 * Retorna uma string de tempo relativo em português a partir de uma data ou string ISO.
 * @param date – instância Date ou string no formato ISO 8601
 */
export function relativeTime(date: Date | string): string {
  // garante que temos um objeto Date
  const d = date instanceof Date ? date : new Date(date);
  const diff = Date.now() - d.getTime();

  if (diff < MINUTE)      return 'agora mesmo';
  if (diff < HOUR)        return `há ${Math.floor(diff / MINUTE)} min`;
  if (diff < DAY)         return `há ${Math.floor(diff / HOUR)} h`;
  if (diff < 2 * DAY)     return 'ontem';
  if (diff < 30 * DAY)    return `há ${Math.floor(diff / DAY)} dias`;

  // para datas mais antigas, exibe data completa
  return d.toLocaleDateString('pt-BR');
}
