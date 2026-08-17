import { useMemo, useState } from 'react';
import DoctorCard from '../components/cards/DoctorCard.jsx';
import FilterSidebar from '../components/filters/FilterSidebar.jsx';
import { PillGroup, RatingFilter } from '../components/filters/FilterControls.jsx';
import { Input, Select } from '../components/ui/Field.jsx';
import { CardGridSkeleton } from '../components/ui/Skeleton.jsx';
import { EmptyState, ErrorState } from '../components/ui/States.jsx';
import { useAsync } from '../hooks/useAsync.js';
import { getDoctors, getHospitals } from '../services/api.js';

const AVAILABILITY = ['available', 'limited', 'waitlist'];
const AVAILABILITY_LABEL = {
  available: 'Available now',
  limited: 'Limited slots',
  waitlist: 'Waitlist',
};

export default function Doctors() {
  const { data: doctors, loading, error, retry } = useAsync(getDoctors, []);
  const { data: hospitals } = useAsync(getHospitals, []);

  const [query, setQuery] = useState('');
  const [specialties, setSpecialties] = useState([]);
  const [cities, setCities] = useState([]);
  const [availability, setAvailability] = useState([]);
  const [minRating, setMinRating] = useState(0);
  const [sort, setSort] = useState('rating');

  const hospitalName = (id) =>
    (hospitals || []).find((h) => h.id === id)?.name;

  const specialtyOptions = useMemo(
    () => unique((doctors || []).map((d) => d.specialty)),
    [doctors]
  );
  const cityOptions = useMemo(
    () => unique((doctors || []).map((d) => d.city)),
    [doctors]
  );

  const toggle = (setter) => (value) =>
    setter((prev) =>
      prev.includes(value) ? prev.filter((x) => x !== value) : [...prev, value]
    );

  const clearAll = () => {
    setSpecialties([]);
    setCities([]);
    setAvailability([]);
    setMinRating(0);
    setQuery('');
  };

  const activeCount =
    specialties.length +
    cities.length +
    availability.length +
    (minRating > 0 ? 1 : 0);

  const results = useMemo(() => {
    let list = doctors || [];
    if (query.trim()) {
      const q = query.toLowerCase();
      list = list.filter(
        (d) =>
          d.name.toLowerCase().includes(q) ||
          d.specialty.toLowerCase().includes(q) ||
          d.expertise.some((e) => e.toLowerCase().includes(q))
      );
    }
    if (specialties.length)
      list = list.filter((d) => specialties.includes(d.specialty));
    if (cities.length) list = list.filter((d) => cities.includes(d.city));
    if (availability.length)
      list = list.filter((d) => availability.includes(d.availability));
    if (minRating > 0) list = list.filter((d) => d.rating >= minRating);

    const sorted = [...list];
    if (sort === 'rating') sorted.sort((a, b) => b.rating - a.rating);
    if (sort === 'experience')
      sorted.sort((a, b) => b.experienceYears - a.experienceYears);
    if (sort === 'name') sorted.sort((a, b) => a.name.localeCompare(b.name));
    return sorted;
  }, [doctors, query, specialties, cities, availability, minRating, sort]);

  return (
    <div className="container-content py-10">
      <header className="mb-8">
        <h1 className="font-display text-3xl font-semibold text-ink-900 sm:text-4xl">
          Doctors
        </h1>
        <p className="mt-2 max-w-2xl text-ink-500">
          Experienced, board-certified specialists ready to consult with you
          before and during your treatment.
        </p>
      </header>

      <div className="grid gap-8 lg:grid-cols-[16rem_1fr]">
        <FilterSidebar activeCount={activeCount} onClear={clearAll}>
          <PillGroup
            label="Specialty"
            options={specialtyOptions}
            selected={specialties}
            onToggle={toggle(setSpecialties)}
          />
          <PillGroup
            label="Location"
            options={cityOptions}
            selected={cities}
            onToggle={toggle(setCities)}
          />
          <div>
            <h4 className="mb-2.5 text-sm font-semibold text-ink-900">
              Availability
            </h4>
            <div className="flex flex-wrap gap-2">
              {AVAILABILITY.map((a) => {
                const active = availability.includes(a);
                return (
                  <button
                    key={a}
                    onClick={() => toggle(setAvailability)(a)}
                    className={
                      'rounded-full border px-3 py-1.5 text-sm transition-colors ' +
                      (active
                        ? 'border-brand-600 bg-brand-50 text-brand-700'
                        : 'border-ink-200 text-ink-600 hover:border-ink-300')
                    }
                  >
                    {AVAILABILITY_LABEL[a]}
                  </button>
                );
              })}
            </div>
          </div>
          <RatingFilter value={minRating} onChange={setMinRating} />
        </FilterSidebar>

        <div>
          <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center">
            <div className="flex-1">
              <Input
                icon="search"
                placeholder="Search doctors, specialties or expertise"
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
                <option value="experience">Most experienced</option>
                <option value="name">Name A–Z</option>
              </Select>
            </div>
          </div>

          {loading ? (
            <CardGridSkeleton count={6} />
          ) : error ? (
            <ErrorState
              description="We couldn't load doctors right now."
              onRetry={retry}
            />
          ) : results.length === 0 ? (
            <EmptyState
              icon="stethoscope"
              title="No doctors match your filters"
              description="Try a different specialty, city or availability."
            />
          ) : (
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
              {results.map((d) => (
                <DoctorCard
                  key={d.id}
                  doctor={d}
                  hospitalName={hospitalName(d.hospitalId)}
                />
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
