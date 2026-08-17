import { cx } from '../../utils/format.js';

const tones = {
  neutral: 'bg-ink-100 text-ink-700',
  brand: 'bg-brand-50 text-brand-700',
  accent: 'bg-accent-50 text-accent-700',
  green: 'bg-emerald-50 text-emerald-700',
  amber: 'bg-amber-50 text-amber-700',
  red: 'bg-red-50 text-red-700',
  outline: 'border border-ink-200 text-ink-700',
};

export default function Badge({ tone = 'neutral', className = '', children }) {
  return (
    <span
      className={cx(
        'inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium',
        tones[tone],
        className
      )}
    >
      {children}
    </span>
  );
}

/** Coloured status pill for consultation / appointment lifecycles. */
export function StatusBadge({ status, className = '' }) {
  const map = {
    Pending: 'amber',
    Processing: 'brand',
    Confirmed: 'green',
    Cancelled: 'red',
    upcoming: 'brand',
    past: 'neutral',
    cancelled: 'red',
    available: 'green',
    limited: 'amber',
    waitlist: 'neutral',
  };
  const labels = {
    upcoming: 'Upcoming',
    past: 'Completed',
    cancelled: 'Cancelled',
    available: 'Available',
    limited: 'Limited slots',
    waitlist: 'Waitlist',
  };
  return (
    <Badge tone={map[status] || 'neutral'} className={className}>
      <span className="h-1.5 w-1.5 rounded-full bg-current opacity-70" />
      {labels[status] || status}
    </Badge>
  );
}
