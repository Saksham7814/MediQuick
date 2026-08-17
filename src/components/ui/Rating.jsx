import Icon from './Icon.jsx';
import { cx } from '../../utils/format.js';

/** Compact star rating with numeric value and optional review count. */
export default function Rating({ value, count, size = 14, className = '' }) {
  return (
    <span className={cx('inline-flex items-center gap-1 text-sm', className)}>
      <Icon name="star" size={size} filled className="text-accent-400" />
      <span className="font-semibold text-ink-900">{value?.toFixed(1)}</span>
      {typeof count === 'number' && (
        <span className="text-ink-500">({count.toLocaleString()})</span>
      )}
    </span>
  );
}
