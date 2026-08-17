import { cx } from '../../utils/format.js';

/**
 * Simple, controlled tab strip.
 * @param {{value:string,label:string,count?:number}[]} tabs
 */
export default function Tabs({ tabs, value, onChange, className = '' }) {
  return (
    <div
      className={cx(
        'inline-flex items-center gap-1 rounded-xl border border-ink-200 bg-ink-50 p-1',
        className
      )}
      role="tablist"
    >
      {tabs.map((tab) => {
        const active = tab.value === value;
        return (
          <button
            key={tab.value}
            role="tab"
            aria-selected={active}
            onClick={() => onChange(tab.value)}
            className={cx(
              'inline-flex items-center gap-1.5 rounded-lg px-3.5 py-1.5 text-sm font-medium transition-all',
              active
                ? 'bg-white text-ink-900 shadow-soft'
                : 'text-ink-500 hover:text-ink-800'
            )}
          >
            {tab.label}
            {typeof tab.count === 'number' && (
              <span
                className={cx(
                  'rounded-full px-1.5 text-xs',
                  active ? 'bg-brand-50 text-brand-700' : 'bg-ink-200 text-ink-600'
                )}
              >
                {tab.count}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}
