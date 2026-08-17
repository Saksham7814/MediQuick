import Icon from '../ui/Icon.jsx';
import { useScrollToTop } from '../layout/SmoothScroll.jsx';

/**
 * The compact search the header search converts into once scrolled — segmented
 * "Treatments · Hospitals · Doctors" with a round search button. Clicking it
 * smoothly scrolls back to the top, which expands the full search again.
 */
export default function SearchPill() {
  const scrollToTop = useScrollToTop();

  return (
    <button
      type="button"
      onClick={() => scrollToTop()}
      className="flex items-center gap-3 whitespace-nowrap rounded-full border border-ink-200 bg-white py-1.5 pl-6 pr-2 text-sm shadow-pill transition-shadow hover:shadow-card-hover"
    >
      <span className="font-semibold text-ink-900">Treatments</span>
      <span className="h-4 w-px bg-ink-200" />
      <span className="font-semibold text-ink-900">Hospitals</span>
      <span className="h-4 w-px bg-ink-200" />
      <span className="font-semibold text-ink-900">Doctors</span>
      <span className="flex h-9 w-9 items-center justify-center rounded-full bg-brand-600 text-white">
        <Icon name="search" size={16} />
      </span>
    </button>
  );
}
