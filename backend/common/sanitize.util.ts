export function sanitizePlayerName(raw: string): string {
  if (typeof raw !== 'string') return '';
  return raw
    .replace(/[^\p{L}\p{N}\-'_.\s]/gu, '')
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, 64);
}
