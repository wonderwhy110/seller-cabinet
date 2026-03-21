export function formatDate(dateStr: string): string {
  return new Intl.DateTimeFormat('ru-RU', { day: 'numeric', month: 'long', year: 'numeric' }).format(new Date(dateStr))
}
