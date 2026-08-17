import Icon from '../ui/Icon.jsx';
import { cx } from '../../utils/format.js';

/** A labelled group of toggleable pill options (multi-select). */
export function PillGroup({ label, options, selected, onToggle }) {
  return (
    <div>
      <h4 className="mb-2.5 text-sm font-semibold text-ink-900">{label}</h4>
      <div className="flex flex-wrap gap-2">
        {options.map((opt) => {
          const active = selected.includes(opt);
          return (
            <button
              key={opt}
              onClick={() => onToggle(opt)}
              className={cx(
                'inline-flex items-center gap-1 rounded-full border px-3 py-1.5 text-sm transition-colors',
                active
                  ? 'border-brand-600 bg-brand-50 text-brand-700'
                  : 'border-ink-200 text-ink-600 hover:border-ink-300'
              )}
            >
              {active && <Icon name="check" size={13} />}
              {opt}
            </button>
          );
        })}
      </div>
    </div>
  );
}

/** Single-select rating filter (4.0+, 4.5+, etc.). */
export function RatingFilter({ value, onChange }) {
  const options = [
    { v: 0, label: 'Any' },
    { v: 4, label: '4.0+' },
    { v: 4.5, label: '4.5+' },
    { v: 4.8, label: '4.8+' },
  ];
  return (
    <div>
      <h4 className="mb-2.5 text-sm font-semibold text-ink-900">Rating</h4>
      <div className="flex flex-wrap gap-2">
        {options.map((o) => (
          <button
            key={o.v}
            onClick={() => onChange(o.v)}
            className={cx(
              'inline-flex items-center gap-1 rounded-full border px-3 py-1.5 text-sm transition-colors',
              value === o.v
                ? 'border-brand-600 bg-brand-50 text-brand-700'
                : 'border-ink-200 text-ink-600 hover:border-ink-300'
            )}
          >
            {o.v > 0 && <Icon name="star" size={13} filled className="text-accent-400" />}
            {o.label}
          </button>
        ))}
      </div>
    </div>
  );
}

/** Max-price slider filter. */
export function PriceFilter({ value, max, onChange, step = 25000 }) {
  const inr = (n) => `₹${n.toLocaleString('en-IN')}`;
  return (
    <div>
      <div className="mb-2.5 flex items-center justify-between">
        <h4 className="text-sm font-semibold text-ink-900">Max estimated price</h4>
        <span className="text-sm font-medium text-brand-700">
          {value >= max ? 'Any' : inr(value)}
        </span>
      </div>
      <input
        type="range"
        min={0}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full accent-brand-600"
      />
      <div className="mt-1 flex justify-between text-xs text-ink-400">
        <span>₹0</span>
        <span>{inr(max)}+</span>
      </div>
    </div>
  );
}
