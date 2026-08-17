import { Link } from 'react-router-dom';
import { cx } from '../../utils/format.js';

/** Wordmark + glyph used in the navbar and footer. */
export default function Logo({ className = '', dark = false }) {
  return (
    <Link to="/" className={cx('inline-flex items-center gap-2', className)}>
      <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-600 text-white">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
          <path
            d="M12 3c-.5 0-.9.3-1.1.8L9.3 8.5H4.6c-.6 0-1 .8-.5 1.2l3.8 2.9-1.5 4.6c-.2.6.5 1.1 1 .8L12 15.2l4.6 2.8c.5.3 1.2-.2 1-.8l-1.5-4.6 3.8-2.9c.5-.4.1-1.2-.5-1.2h-4.7L13.1 3.8A1.2 1.2 0 0 0 12 3Z"
            fill="currentColor"
          />
        </svg>
      </span>
      <span
        className={cx(
          'font-display text-xl font-semibold tracking-tight',
          dark ? 'text-white' : 'text-ink-900'
        )}
      >
        Mediquick
      </span>
    </Link>
  );
}
