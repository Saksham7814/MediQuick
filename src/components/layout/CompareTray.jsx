import { useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext.jsx';
import Button from '../ui/Button.jsx';
import Icon from '../ui/Icon.jsx';

/**
 * Floating tray that appears when items are queued for comparison, giving a
 * quick jump to the compare page — a small touch that makes the feature
 * feel connected across the app.
 */
export default function CompareTray() {
  const { compareCount, compare, clearCompare } = useApp();
  const navigate = useNavigate();

  if (compareCount === 0) return null;

  const activeType =
    ['hospital', 'doctor', 'treatment'].find((t) => compare[t]?.length > 0) || 'hospital';

  return (
    <div className="fixed inset-x-0 bottom-5 z-40 flex justify-center px-4">
      <div className="flex items-center gap-3 rounded-2xl border border-ink-200 bg-white/95 px-4 py-3 shadow-card-hover backdrop-blur animate-fade-up">
        <span className="flex h-9 w-9 items-center justify-center rounded-full bg-brand-50 text-brand-700">
          <Icon name="scale" size={18} />
        </span>
        <div className="pr-1">
          <p className="text-sm font-semibold text-ink-900">
            {compareCount} item{compareCount > 1 ? 's' : ''} to compare
          </p>
          <button
            onClick={() => clearCompare(activeType)}
            className="text-xs text-ink-500 hover:text-ink-800"
          >
            Clear
          </button>
        </div>
        <Button size="sm" onClick={() => navigate('/compare')}>
          Compare now
          <Icon name="arrowRight" size={16} />
        </Button>
      </div>
    </div>
  );
}
