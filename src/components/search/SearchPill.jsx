import { Link } from 'react-router-dom';
import Icon from '../ui/Icon.jsx';

/**
 * The compact search the header search converts into once scrolled — segmented
 * "Treatments · Hospitals · Doctors" with a round search button. Each segment
 * links to its listing page; the button opens the Explore search.
 */
export default function SearchPill() {
  const seg =
    'rounded-full px-2.5 py-1 font-semibold text-ink-900 transition-colors hover:bg-ink-50';

  return (
    <div className="flex items-center gap-1 whitespace-nowrap rounded-full border border-ink-200 bg-white py-1.5 pl-3 pr-2 text-sm shadow-pill">
      <Link to="/treatments" className={seg}>
        Treatments
      </Link>
      <span className="h-4 w-px bg-ink-200" />
      <Link to="/hospitals" className={seg}>
        Hospitals
      </Link>
      <span className="h-4 w-px bg-ink-200" />
      <Link to="/doctors" className={seg}>
        Doctors
      </Link>
      <Link
        to="/explore"
        aria-label="Search"
        className="ml-1 flex h-9 w-9 items-center justify-center rounded-full bg-brand-600 text-white transition-colors hover:bg-brand-700"
      >
        <Icon name="search" size={16} />
      </Link>
    </div>
  );
}
