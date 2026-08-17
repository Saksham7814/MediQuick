import { useState } from 'react';
import Icon from '../ui/Icon.jsx';
import { cx } from '../../utils/format.js';

/**
 * Responsive filter container: a sticky sidebar on desktop, a collapsible
 * panel on mobile triggered by a "Filters" button. Keeps every listing page's
 * filter layout consistent.
 */
export default function FilterSidebar({ children, activeCount = 0, onClear }) {
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* Mobile trigger */}
      <button
        onClick={() => setOpen((o) => !o)}
        className="mb-4 inline-flex items-center gap-2 rounded-xl border border-ink-200 px-4 py-2.5 text-sm font-semibold text-ink-800 lg:hidden"
      >
        <Icon name="sliders" size={18} />
        Filters
        {activeCount > 0 && (
          <span className="rounded-full bg-brand-600 px-1.5 text-xs text-white">
            {activeCount}
          </span>
        )}
      </button>

      <aside
        className={cx(
          'lg:sticky lg:top-20 lg:block lg:self-start',
          open ? 'block' : 'hidden'
        )}
      >
        <div className="rounded-2xl border border-ink-100 bg-white p-5 shadow-card lg:w-64">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="font-semibold text-ink-900">Filters</h3>
            {activeCount > 0 && (
              <button
                onClick={onClear}
                className="text-sm font-medium text-brand-700 hover:text-brand-800"
              >
                Clear all
              </button>
            )}
          </div>
          <div className="space-y-6">{children}</div>
        </div>
      </aside>
    </>
  );
}
