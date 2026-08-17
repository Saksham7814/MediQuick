import { cx } from '../../utils/format.js';
import Icon from './Icon.jsx';

/** Wraps a labelled form control with optional hint and error message. */
export function Field({ label, htmlFor, error, hint, required, children, className = '' }) {
  return (
    <div className={className}>
      {label && (
        <label
          htmlFor={htmlFor}
          className="mb-1.5 block text-sm font-medium text-ink-800"
        >
          {label}
          {required && <span className="ml-0.5 text-red-500">*</span>}
        </label>
      )}
      {children}
      {error ? (
        <p className="mt-1.5 flex items-center gap-1 text-xs font-medium text-red-600">
          <Icon name="info" size={13} />
          {error}
        </p>
      ) : hint ? (
        <p className="mt-1.5 text-xs text-ink-500">{hint}</p>
      ) : null}
    </div>
  );
}

const baseControl =
  'w-full rounded-xl border bg-white px-3.5 text-[15px] text-ink-900 placeholder:text-ink-400 transition-colors focus:border-brand-500 disabled:bg-ink-50';

export function Input({ error, className = '', icon, ...props }) {
  return (
    <div className="relative">
      {icon && (
        <span className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-400">
          <Icon name={icon} size={18} />
        </span>
      )}
      <input
        className={cx(
          baseControl,
          'h-11',
          icon && 'pl-10',
          error ? 'border-red-400' : 'border-ink-200',
          className
        )}
        {...props}
      />
    </div>
  );
}

export function Textarea({ error, className = '', rows = 4, ...props }) {
  return (
    <textarea
      rows={rows}
      className={cx(
        baseControl,
        'resize-none py-2.5 leading-relaxed',
        error ? 'border-red-400' : 'border-ink-200',
        className
      )}
      {...props}
    />
  );
}

export function Select({ error, className = '', children, ...props }) {
  return (
    <div className="relative">
      <select
        className={cx(
          baseControl,
          'h-11 appearance-none pr-10',
          error ? 'border-red-400' : 'border-ink-200',
          className
        )}
        {...props}
      >
        {children}
      </select>
      <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-ink-400">
        <Icon name="chevronDown" size={18} />
      </span>
    </div>
  );
}
