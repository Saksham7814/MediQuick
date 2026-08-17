import { useApp } from '../../context/AppContext.jsx';
import { useToast } from '../../context/ToastContext.jsx';
import Icon from './Icon.jsx';
import { cx } from '../../utils/format.js';

const labels = { hospital: 'Hospital', doctor: 'Doctor', treatment: 'Treatment' };

/**
 * Heart/save toggle. `floating` renders the round overlay button used on card
 * images; otherwise it renders an inline pill button for detail pages.
 */
export default function SaveButton({ type, id, floating = false, className = '' }) {
  const { isSaved, toggleSaved } = useApp();
  const { toast } = useToast();
  const saved = isSaved(type, id);

  const handleClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    const added = toggleSaved(type, id);
    toast(
      added ? `${labels[type]} saved` : `Removed from saved`,
      { type: added ? 'success' : 'default' }
    );
  };

  if (floating) {
    return (
      <button
        onClick={handleClick}
        aria-label={saved ? 'Remove from saved' : 'Save'}
        aria-pressed={saved}
        className={cx(
          'flex h-9 w-9 items-center justify-center rounded-full bg-white/90 backdrop-blur transition-all hover:scale-105 hover:bg-white active:scale-95',
          className
        )}
      >
        <Icon
          name="heart"
          size={18}
          filled={saved}
          className={saved ? 'text-brand-600' : 'text-ink-700'}
        />
      </button>
    );
  }

  return (
    <button
      onClick={handleClick}
      aria-pressed={saved}
      className={cx(
        'inline-flex h-11 items-center justify-center gap-2 rounded-xl border px-4 text-sm font-semibold transition-colors',
        saved
          ? 'border-brand-200 bg-brand-50 text-brand-600'
          : 'border-ink-200 bg-white text-ink-800 hover:bg-ink-50',
        className
      )}
    >
      <Icon name="heart" size={18} filled={saved} />
      {saved ? 'Saved' : 'Save'}
    </button>
  );
}
