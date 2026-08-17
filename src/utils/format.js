/** Small formatting helpers shared across the app. */

/** "₹3,73,500 – ₹5,39,500" from a Money object, or a single value. */
export function formatPriceRange(money) {
  if (!money) return '—';
  const { min, max, currency = 'INR' } = money;
  const symbol = currencySymbol(currency);
  if (min === max) return `${symbol}${formatAmount(min)}`;
  return `${symbol}${formatAmount(min)} – ${symbol}${formatAmount(max)}`;
}

/** Compact "from ₹3,73,500" used on cards. */
export function formatFrom(money) {
  if (!money) return '—';
  return `from ${currencySymbol(money.currency)}${formatAmount(money.min)}`;
}

/** Group digits Indian-style for INR, otherwise use the default grouping. */
export function formatAmount(value, currency = 'INR') {
  return value.toLocaleString(currency === 'INR' ? 'en-IN' : undefined);
}

export function currencySymbol(currency = 'INR') {
  const map = { USD: '$', EUR: '€', GBP: '£', INR: '₹' };
  return map[currency] || `${currency} `;
}

/** "17 Aug 2026" */
export function formatDate(input) {
  if (!input) return '—';
  const d = new Date(input);
  if (Number.isNaN(d.getTime())) return String(input);
  return d.toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

/** Relative time like "2h ago", "3d ago". */
export function timeAgo(input) {
  const d = new Date(input);
  const seconds = Math.floor((Date.now() - d.getTime()) / 1000);
  if (seconds < 60) return 'just now';
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days}d ago`;
  return formatDate(input);
}

/** "10:32 AM" from an ISO timestamp. */
export function formatTime(input) {
  const d = new Date(input);
  if (Number.isNaN(d.getTime())) return '';
  return d.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
  });
}

export function titleCase(str = '') {
  return str.replace(/\b\w/g, (c) => c.toUpperCase());
}

/** Join class names, skipping falsy values. */
export function cx(...classes) {
  return classes.filter(Boolean).join(' ');
}
