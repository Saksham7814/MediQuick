import { Link } from 'react-router-dom';
import Icon from '../ui/Icon.jsx';
import { Skeleton } from '../ui/Skeleton.jsx';

/** Breadcrumb trail shown at the top of every detail page. */
export function Breadcrumb({ trail }) {
  return (
    <nav className="mb-5 flex items-center gap-1.5 text-sm text-ink-500">
      <Link to="/" className="hover:text-ink-900">
        Home
      </Link>
      {trail.map((item, i) => (
        <span key={i} className="flex items-center gap-1.5">
          <Icon name="chevronRight" size={14} className="text-ink-300" />
          {item.to ? (
            <Link to={item.to} className="hover:text-ink-900">
              {item.label}
            </Link>
          ) : (
            <span className="max-w-[16rem] truncate font-medium text-ink-700">
              {item.label}
            </span>
          )}
        </span>
      ))}
    </nav>
  );
}

/** Titled content section with consistent spacing. */
export function Section({ title, children, className = '' }) {
  return (
    <section className={`mt-8 ${className}`}>
      <h2 className="mb-3.5 text-lg font-semibold text-ink-900">{title}</h2>
      {children}
    </section>
  );
}

/** Row of small stat tiles. */
export function QuickFacts({ facts }) {
  return (
    <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
      {facts.map((f) => (
        <div key={f.label} className="rounded-xl border border-ink-100 bg-white p-4">
          <Icon name={f.icon} size={18} className="text-brand-600" />
          <p className="mt-2 text-lg font-semibold text-ink-900">{f.value}</p>
          <p className="text-xs text-ink-500">{f.label}</p>
        </div>
      ))}
    </div>
  );
}

/** Generic detail-page loading skeleton. */
export function DetailSkeleton({ withGallery = false }) {
  return (
    <div className="container-content py-8">
      <Skeleton className="mb-6 h-5 w-48" />
      {withGallery && (
        <div className="mb-8 grid gap-3 sm:grid-cols-[2fr_1fr]">
          <Skeleton className="aspect-[16/10] rounded-2xl" />
          <div className="grid grid-cols-2 gap-3">
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="aspect-[16/10] rounded-xl" />
            ))}
          </div>
        </div>
      )}
      <div className="grid gap-10 lg:grid-cols-[1fr_20rem]">
        <div className="space-y-4">
          <Skeleton className="h-9 w-2/3" />
          <Skeleton className="h-5 w-1/2" />
          <Skeleton className="h-24 w-full" />
          <Skeleton className="h-40 w-full" />
        </div>
        <Skeleton className="h-72 rounded-2xl" />
      </div>
    </div>
  );
}
