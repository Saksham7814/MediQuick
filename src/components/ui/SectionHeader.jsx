import { Link } from 'react-router-dom';
import Icon from './Icon.jsx';

/** Consistent section title + optional "view all" link used across pages. */
export default function SectionHeader({ eyebrow, title, description, action }) {
  return (
    <div className="mb-7 flex items-end justify-between gap-4">
      <div>
        {eyebrow && (
          <p className="mb-1.5 text-sm font-semibold uppercase tracking-wide text-brand-600">
            {eyebrow}
          </p>
        )}
        <h2 className="font-display text-2xl font-semibold text-ink-900 sm:text-3xl">
          {title}
        </h2>
        {description && (
          <p className="mt-2 max-w-2xl text-ink-500">{description}</p>
        )}
      </div>
      {action && (
        <Link
          to={action.to}
          className="hidden shrink-0 items-center gap-1 text-sm font-semibold text-brand-700 hover:text-brand-800 sm:inline-flex"
        >
          {action.label}
          <Icon name="arrowRight" size={16} />
        </Link>
      )}
    </div>
  );
}
