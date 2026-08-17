import { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import TreatmentCard from '../components/cards/TreatmentCard.jsx';
import FilterSidebar from '../components/filters/FilterSidebar.jsx';
import { PillGroup, PriceFilter } from '../components/filters/FilterControls.jsx';
import { Input, Select } from '../components/ui/Field.jsx';
import { CardGridSkeleton } from '../components/ui/Skeleton.jsx';
import { EmptyState, ErrorState } from '../components/ui/States.jsx';
import { useAsync } from '../hooks/useAsync.js';
import { getTreatments } from '../services/api.js';
import { TREATMENT_CATEGORIES } from '../data/models.js';

const PRICE_MAX = 2000000;

export default function Treatments() {
  const { data: treatments, loading, error, retry } = useAsync(getTreatments, []);
  const [searchParams, setSearchParams] = useSearchParams();

  const [query, setQuery] = useState('');
  const [categories, setCategories] = useState([]);
  const [maxPrice, setMaxPrice] = useState(PRICE_MAX);
  const [sort, setSort] = useState('popular');

  // Seed category from the URL (e.g. arriving from the home category grid).
  useEffect(() => {
    const cat = searchParams.get('category');
    if (cat && TREATMENT_CATEGORIES.includes(cat)) setCategories([cat]);
  }, [searchParams]);

  const toggleCategory = (value) =>
    setCategories((prev) =>
      prev.includes(value) ? prev.filter((x) => x !== value) : [...prev, value]
    );

  const clearAll = () => {
    setCategories([]);
    setMaxPrice(PRICE_MAX);
    setQuery('');
    setSearchParams({});
  };

  const activeCount = categories.length + (maxPrice < PRICE_MAX ? 1 : 0);

  const results = useMemo(() => {
    let list = treatments || [];
    if (query.trim()) {
      const q = query.toLowerCase();
      list = list.filter(
        (t) =>
          t.name.toLowerCase().includes(q) ||
          t.shortDescription.toLowerCase().includes(q) ||
          t.category.toLowerCase().includes(q)
      );
    }
    if (categories.length) list = list.filter((t) => categories.includes(t.category));
    if (maxPrice < PRICE_MAX) list = list.filter((t) => t.cost.min <= maxPrice);

    const sorted = [...list];
    if (sort === 'popular') sorted.sort((a, b) => b.popularity - a.popularity);
    if (sort === 'price-low') sorted.sort((a, b) => a.cost.min - b.cost.min);
    if (sort === 'price-high') sorted.sort((a, b) => b.cost.min - a.cost.min);
    return sorted;
  }, [treatments, query, categories, maxPrice, sort]);

  return (
    <div className="container-content py-10">
      <header className="mb-8">
        <h1 className="font-display text-3xl font-semibold text-ink-900 sm:text-4xl">
          Treatments
        </h1>
        <p className="mt-2 max-w-2xl text-ink-500">
          Transparent, all-inclusive treatment estimates across the specialties
          patients travel to India for.
        </p>
      </header>

      <div className="grid gap-8 lg:grid-cols-[16rem_1fr]">
        <FilterSidebar activeCount={activeCount} onClear={clearAll}>
          <PillGroup
            label="Category"
            options={TREATMENT_CATEGORIES}
            selected={categories}
            onToggle={toggleCategory}
          />
          <PriceFilter value={maxPrice} max={PRICE_MAX} onChange={setMaxPrice} />
        </FilterSidebar>

        <div>
          <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center">
            <div className="flex-1">
              <Input
                icon="search"
                placeholder="Search treatments"
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
                <option value="popular">Most popular</option>
                <option value="price-low">Price: low to high</option>
                <option value="price-high">Price: high to low</option>
              </Select>
            </div>
          </div>

          {loading ? (
            <CardGridSkeleton count={6} />
          ) : error ? (
            <ErrorState
              description="We couldn't load treatments right now."
              onRetry={retry}
            />
          ) : results.length === 0 ? (
            <EmptyState
              icon="sparkles"
              title="No treatments match your filters"
              description="Try a different category or widen your price range."
            />
          ) : (
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
              {results.map((t) => (
                <TreatmentCard key={t.id} treatment={t} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
