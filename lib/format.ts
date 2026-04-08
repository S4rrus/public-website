export function formatDate(dateString?: string) {
  if (!dateString) return '';
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('en', {
    month: 'long',
    day: 'numeric',
    year: 'numeric'
  }).format(date);
}

export function formatMonthYear(dateString?: string) {
  if (!dateString) return '';
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('en', {
    month: 'short',
    year: 'numeric'
  }).format(date);
}

export function formatYear(dateString?: string) {
  if (!dateString) return '';
  return new Date(dateString).getFullYear().toString();
}

export function rankBadgeClass(rank?: number) {
  if (!rank) return 'rank-low';
  if (rank <= 10) return 'rank-top';
  if (rank <= 30) return 'rank-mid';
  return 'rank-low';
}
