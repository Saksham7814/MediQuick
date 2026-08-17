import { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import HospitalCard from '../components/cards/HospitalCard.jsx';
import DoctorCard from '../components/cards/DoctorCard.jsx';
import TreatmentCard from '../components/cards/TreatmentCard.jsx';
import Tabs from '../components/ui/Tabs.jsx';
import { Input } from '../components/ui/Field.jsx';
import { CardGridSkeleton } from '../components/ui/Skeleton.jsx';
import { EmptyState, ErrorState } from '../components/ui/States.jsx';
import SectionHeader from '../components/ui/SectionHeader.jsx';
import { useAsync } from '../hooks/useAsync.js';
import { getHospitals, getDoctors, getTreatments } from '../services/api.js';

const loadAll = () =>
  Promise.all([getHospitals(), getDoctors(), getTreatments()]).then(
    ([hospitals, doctors, treatments]) => ({ hospitals, doctors, treatments })
  );

export default function Explore() {
  const { data, loading, error, retry } = useAsync(loadAll, []);
  const [searchParams, setSearchParams] = useSearchParams();

  const [query, setQuery] = useState(searchParams.get('q') || '');
  const [type, setType] = useState(searchParams.get('type') || 'all');

  // Keep the URL in sync so results are shareable.
  useEffect(() => {
    const params = new URLSearchParams();
    if (query.trim()) params.set('q', query.trim());
    if (type !== 'all') params.set('type', type);
    setSearchParams(params, { replace: true });
  }, [query, type, setSearchParams]);

  const hospitals = data?.hospitals || [];
  const doctors = data?.doctors || [];
  const treatments = data?.treatments || [];
  const hospitalName = (id) => hospitals.find((h) => h.id === id)?.name;

  const q = query.trim().toLowerCase();

  const filtered = useMemo(() => {
    const h = hospitals.filter(
      (x) =>
        !q ||
        x.name.toLowerCase().includes(q) ||
        x.city.toLowerCase().includes(q) ||
        x.specialties.some((s) => s.toLowerCase().includes(q))
    );
    const d = doctors.filter(
      (x) =>
        !q ||
        x.name.toLowerCase().includes(q) ||
        x.specialty.toLowerCase().includes(q) ||
        x.city.toLowerCase().includes(q)
    );
    const t = treatments.filter(
      (x) =>
        !q ||
        x.name.toLowerCase().includes(q) ||
        x.category.toLowerCase().includes(q) ||
        x.shortDescription.toLowerCase().includes(q)
    );
    return { h, d, t };
  }, [hospitals, doctors, treatments, q]);

  const total = filtered.h.length + filtered.d.length + filtered.t.length;

  const tabs = [
    { value: 'all', label: 'All', count: total },
    { value: 'hospital', label: 'Hospitals', count: filtered.h.length },
    { value: 'doctor', label: 'Doctors', count: filtered.d.length },
    { value: 'treatment', label: 'Treatments', count: filtered.t.length },
  ];

  const showH = type === 'all' || type === 'hospital';
  const showD = type === 'all' || type === 'doctor';
  const showT = type === 'all' || type === 'treatment';
  const nothing =
    (showH ? filtered.h.length : 0) +
      (showD ? filtered.d.length : 0) +
      (showT ? filtered.t.length : 0) ===
    0;

  return (
    <div className="container-content py-10">
      <header className="mb-6">
        <h1 className="font-display text-3xl font-semibold text-ink-900 sm:text-4xl">
          Explore
        </h1>
        <p className="mt-2 max-w-2xl text-ink-500">
          Search across hospitals, doctors and treatments in one place.
        </p>
      </header>

      <div className="mb-6 flex flex-col gap-4">
        <Input
          icon="search"
          placeholder="Search treatments, hospitals, doctors or specialties"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="h-12 text-base"
        />
        <div className="overflow-x-auto no-scrollbar">
          <Tabs tabs={tabs} value={type} onChange={setType} />
        </div>
      </div>

      {loading ? (
        <CardGridSkeleton count={6} />
      ) : error ? (
        <ErrorState description="We couldn't load results right now." onRetry={retry} />
      ) : nothing ? (
        <EmptyState
          icon="search"
          title={q ? `No results for “${query}”` : 'Start your search'}
          description="Try a treatment like “knee replacement”, a city like “Delhi”, or a specialty like “cardiology”."
        />
      ) : (
        <div className="space-y-12">
          {showT && filtered.t.length > 0 && (
            <section>
              {type === 'all' && (
                <SectionHeader title="Treatments" action={{ to: '/treatments', label: 'All treatments' }} />
              )}
              <Grid>
                {filtered.t.map((t) => (
                  <TreatmentCard key={t.id} treatment={t} />
                ))}
              </Grid>
            </section>
          )}

          {showH && filtered.h.length > 0 && (
            <section>
              {type === 'all' && (
                <SectionHeader title="Hospitals & clinics" action={{ to: '/hospitals', label: 'All hospitals' }} />
              )}
              <Grid>
                {filtered.h.map((h) => (
                  <HospitalCard key={h.id} hospital={h} />
                ))}
              </Grid>
            </section>
          )}

          {showD && filtered.d.length > 0 && (
            <section>
              {type === 'all' && (
                <SectionHeader title="Doctors" action={{ to: '/doctors', label: 'All doctors' }} />
              )}
              <Grid>
                {filtered.d.map((d) => (
                  <DoctorCard key={d.id} doctor={d} hospitalName={hospitalName(d.hospitalId)} />
                ))}
              </Grid>
            </section>
          )}
        </div>
      )}
    </div>
  );
}

function Grid({ children }) {
  return (
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {children}
    </div>
  );
}
