// File: src/hooks/useRelativeTime.ts

const MINUTE = 60_000;
const HOUR = 60 * MINUTE;
const DAY = 24 * HOUR;

/**
 * Retorna uma string representando o tempo relativo entre `date` e agora.
 * @param date - Uma instância de Date ou string ISO.
 * @param short - Quando true, usa versões curtas ("3 h"); se false, usa "há 3 horas".
 */
export function useRelativeTime(date: Date | string, short = true): string {
  const d = date instanceof Date ? date : new Date(date);
  const now = Date.now();
  const diff = now - d.getTime();

  if (diff < MINUTE) return short ? 'agora' : 'agora mesmo';

  if (diff < HOUR) {
    const m = Math.floor(diff / MINUTE);
    return short ? `${m} min` : `há ${m} ${m === 1 ? 'minuto' : 'minutos'}`;
  }

  if (diff < DAY) {
    const h = Math.floor(diff / HOUR);
    return short ? `${h} h` : `há ${h} ${h === 1 ? 'hora' : 'horas'}`;
  }

  if (diff < 2 * DAY) return short ? 'ontem' : 'há 1 dia';

  if (diff < 30 * DAY) {
    const dCount = Math.floor(diff / DAY);
    return short ? `${dCount} d` : `há ${dCount} dias`;
  }

  return d.toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
}
