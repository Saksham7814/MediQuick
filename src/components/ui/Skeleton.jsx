import { cx } from '../../utils/format.js';

/** Shimmering placeholder block. */
export function Skeleton({ className = '' }) {
  return <div className={cx('skeleton rounded-lg', className)} />;
}

/** Card-shaped skeleton matching the listing cards. */
export function CardSkeleton() {
  return (
    <div className="overflow-hidden rounded-2xl border border-ink-100 bg-white">
      <Skeleton className="aspect-[4/3] w-full rounded-none" />
      <div className="space-y-3 p-4">
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-3 w-1/2" />
        <div className="flex gap-2 pt-1">
          <Skeleton className="h-6 w-16 rounded-full" />
          <Skeleton className="h-6 w-20 rounded-full" />
        </div>
        <Skeleton className="h-4 w-1/3" />
      </div>
    </div>
  );
}

export function CardGridSkeleton({ count = 6 }) {
  return (
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: count }).map((_, i) => (
        <CardSkeleton key={i} />
      ))}
    </div>
  );
}
