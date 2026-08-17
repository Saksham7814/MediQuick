import { useApp } from '../../context/AppContext.jsx';
import { useToast } from '../../context/ToastContext.jsx';
import Icon from './Icon.jsx';
import { cx } from '../../utils/format.js';

/** Toggle an item into the compare tray (max enforced by AppContext). */
export default function CompareButton({ type, id, className = '', size = 'md' }) {
  const { inCompare, toggleCompare, MAX_COMPARE } = useApp();
  const { toast } = useToast();
  const active = inCompare(type, id);

  const handleClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    const { added, full } = toggleCompare(type, id);
    if (full) {
      toast(`You can compare up to ${MAX_COMPARE} items`, { type: 'default' });
    } else {
      toast(added ? 'Added to compare' : 'Removed from compare', {
        type: added ? 'success' : 'default',
      });
    }
  };

  const height = size === 'sm' ? 'h-9 px-3 text-sm' : 'h-11 px-4 text-sm';

  return (
    <button
      onClick={handleClick}
      aria-pressed={active}
      className={cx(
        'inline-flex items-center justify-center gap-2 rounded-xl border font-semibold transition-colors',
        height,
        active
          ? 'border-brand-200 bg-brand-50 text-brand-700'
          : 'border-ink-200 bg-white text-ink-800 hover:bg-ink-50',
        className
      )}
    >
      <Icon name={active ? 'check' : 'scale'} size={18} />
      {active ? 'Comparing' : 'Compare'}
    </button>
  );
}
