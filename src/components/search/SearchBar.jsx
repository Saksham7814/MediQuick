import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from '../ui/Icon.jsx';

/**
 * The expanded search shown in the header on the home page. Two segments
 * (treatment + location) and a round action button, in the spirit of a modern
 * travel search. Submitting routes to /explore with the query.
 */
export default function SearchBar({ compactOnMobile = true }) {
  const [treatment, setTreatment] = useState('');
  const [location, setLocation] = useState('');
  const navigate = useNavigate();

  const submit = (e) => {
    e.preventDefault();
    const q = [treatment.trim(), location.trim()].filter(Boolean).join(' ');
    const params = new URLSearchParams();
    if (q) params.set('q', q);
    navigate(`/explore?${params.toString()}`);
  };

  return (
    <form
      onSubmit={submit}
      className="mx-auto flex w-full max-w-2xl items-center rounded-full border border-ink-200 bg-white p-1.5 shadow-pill transition-shadow hover:shadow-card-hover"
    >
      <label className="flex-1 cursor-text rounded-full px-5 py-1.5 transition-colors hover:bg-ink-50">
        <span className="block text-[11px] font-semibold text-ink-900">
          Treatment
        </span>
        <input
          value={treatment}
          onChange={(e) => setTreatment(e.target.value)}
          placeholder="What are you looking for?"
          className="w-full border-0 bg-transparent p-0 text-sm text-ink-800 placeholder:text-ink-400 focus:outline-none focus:ring-0"
        />
      </label>

      <div className={compactOnMobile ? 'hidden h-8 w-px bg-ink-200 sm:block' : 'h-8 w-px bg-ink-200'} />

      <label
        className={
          (compactOnMobile ? 'hidden sm:block ' : '') +
          'flex-1 cursor-text rounded-full px-5 py-1.5 transition-colors hover:bg-ink-50'
        }
      >
        <span className="block text-[11px] font-semibold text-ink-900">
          Location
        </span>
        <input
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          placeholder="Anywhere in India"
          className="w-full border-0 bg-transparent p-0 text-sm text-ink-800 placeholder:text-ink-400 focus:outline-none focus:ring-0"
        />
      </label>

      <button
        type="submit"
        aria-label="Search"
        className="ml-1 flex h-11 shrink-0 items-center gap-2 rounded-full bg-brand-600 px-4 font-semibold text-white transition-colors hover:bg-brand-700"
      >
        <Icon name="search" size={18} />
        <span className="hidden pr-1 sm:inline">Search</span>
      </button>
    </form>
  );
}
