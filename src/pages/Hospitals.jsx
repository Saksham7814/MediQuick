import { useMemo, useState } from 'react';
import HospitalCard from '../components/cards/HospitalCard.jsx';
import FilterSidebar from '../components/filters/FilterSidebar.jsx';
import { PillGroup, RatingFilter, PriceFilter } from '../components/filters/FilterControls.jsx';
import { Input, Select } from '../components/ui/Field.jsx';
import { CardGridSkeleton } from '../components/ui/Skeleton.jsx';
import { EmptyState, ErrorState } from '../components/ui/States.jsx';
import { useAsync } from '../hooks/useAsync.js';
import { getHospitals } from '../services/api.js';

const PRICE_MAX = 2000000;

export default function Hospitals() {
  const { data: hospitals, loading, error, retry } = useAsync(getHospitals, []);

  const [query, setQuery] = useState('');
  const [cities, setCities] = useState([]);
  const [specialties, setSpecialties] = useState([]);
  const [minRating, setMinRating] = useState(0);
  const [maxPrice, setMaxPrice] = useState(PRICE_MAX);
  const [sort, setSort] = useState('rating');

  const cityOptions = useMemo(
    () => unique((hospitals || []).map((h) => h.city)),
    [hospitals]
  );
  const specialtyOptions = useMemo(
    () => unique((hospitals || []).flatMap((h) => h.specialties)),
    [hospitals]
  );

  const toggle = (setter) => (value) =>
    setter((prev) =>
      prev.includes(value) ? prev.filter((x) => x !== value) : [...prev, value]
    );

  const clearAll = () => {
    setCities([]);
    setSpecialties([]);
    setMinRating(0);
    setMaxPrice(PRICE_MAX);
    setQuery('');
  };

  const activeCount =
    cities.length +
    specialties.length +
    (minRating > 0 ? 1 : 0) +
    (maxPrice < PRICE_MAX ? 1 : 0);

  const results = useMemo(() => {
    let list = hospitals || [];
    if (query.trim()) {
      const q = query.toLowerCase();
      list = list.filter(
        (h) =>
          h.name.toLowerCase().includes(q) ||
          h.city.toLowerCase().includes(q) ||
          h.specialties.some((s) => s.toLowerCase().includes(q))
      );
    }
    if (cities.length) list = list.filter((h) => cities.includes(h.city));
    if (specialties.length)
      list = list.filter((h) => specialties.some((s) => h.specialties.includes(s)));
    if (minRating > 0) list = list.filter((h) => h.rating >= minRating);
    if (maxPrice < PRICE_MAX)
      list = list.filter((h) => h.priceRange.min <= maxPrice);

    const sorted = [...list];
    if (sort === 'rating') sorted.sort((a, b) => b.rating - a.rating);
    if (sort === 'price-low') sorted.sort((a, b) => a.priceRange.min - b.priceRange.min);
    if (sort === 'name') sorted.sort((a, b) => a.name.localeCompare(b.name));
    return sorted;
  }, [hospitals, query, cities, specialties, minRating, maxPrice, sort]);

  return (
    <div className="container-content py-10">
      <header className="mb-8">
        <h1 className="font-display text-3xl font-semibold text-ink-900 sm:text-4xl">
          Hospitals &amp; Clinics
        </h1>
        <p className="mt-2 max-w-2xl text-ink-500">
          Accredited hospitals and specialist clinics across India, with
          dedicated support for international patients.
        </p>
      </header>

      <div className="grid gap-8 lg:grid-cols-[16rem_1fr]">
        <FilterSidebar activeCount={activeCount} onClear={clearAll}>
          <PillGroup
            label="Location"
            options={cityOptions}
            selected={cities}
            onToggle={toggle(setCities)}
          />
          <PillGroup
            label="Specialty"
            options={specialtyOptions}
            selected={specialties}
            onToggle={toggle(setSpecialties)}
          />
          <RatingFilter value={minRating} onChange={setMinRating} />
          <PriceFilter value={maxPrice} max={PRICE_MAX} onChange={setMaxPrice} />
        </FilterSidebar>

        <div>
          <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center">
            <div className="flex-1">
              <Input
                icon="search"
                placeholder="Search hospitals, cities or specialties"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
            </div>
            <div className="flex items-center gap-3">
              <span className="hidden whitespace-nowrap text-sm text-ink-500 sm:block">
                {loading ? '—' : `${results.length} results`}
              </span>
              <Select
                value={sort}
                onChange={(e) => setSort(e.target.value)}
                className="w-44"
              >
                <option value="rating">Top rated</option>
                <option value="price-low">Price: low to high</option>
                <option value="name">Name A–Z</option>
              </Select>
            </div>
          </div>

          {loading ? (
            <CardGridSkeleton count={6} />
          ) : error ? (
            <ErrorState
              description="We couldn't load hospitals right now."
              onRetry={retry}
            />
          ) : results.length === 0 ? (
            <EmptyState
              icon="building"
              title="No hospitals match your filters"
              description="Try removing a filter or searching for a different city or specialty."
            />
          ) : (
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
              {results.map((h) => (
                <HospitalCard key={h.id} hospital={h} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function unique(arr) {
  return Array.from(new Set(arr)).sort();
}
