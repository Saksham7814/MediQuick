import { useState } from 'react';
import { Link } from 'react-router-dom';
import Tabs from '../components/ui/Tabs.jsx';
import Button from '../components/ui/Button.jsx';
import Rating from '../components/ui/Rating.jsx';
import Icon from '../components/ui/Icon.jsx';
import SmartImage from '../components/ui/SmartImage.jsx';
import { StatusBadge } from '../components/ui/Badge.jsx';
import { EmptyState } from '../components/ui/States.jsx';
import { Skeleton } from '../components/ui/Skeleton.jsx';
import { useApp } from '../context/AppContext.jsx';
import { useAsync } from '../hooks/useAsync.js';
import { getHospitals, getDoctors, getTreatments } from '../services/api.js';
import { formatPriceRange } from '../utils/format.js';

const loadAll = () =>
  Promise.all([getHospitals(), getDoctors(), getTreatments()]).then(
    ([hospitals, doctors, treatments]) => ({ hospitals, doctors, treatments })
  );

export default function Compare() {
  const { compare, toggleCompare, clearCompare } = useApp();
  const { data, loading } = useAsync(loadAll, []);
  const [tab, setTab] = useState('hospital');

  const tabs = [
    { value: 'hospital', label: 'Hospitals', count: compare.hospital.length },
    { value: 'doctor', label: 'Doctors', count: compare.doctor.length },
    { value: 'treatment', label: 'Treatments', count: compare.treatment.length },
  ];

  return (
    <div className="container-content py-10">
      <header className="mb-6">
        <h1 className="font-display text-3xl font-semibold text-ink-900 sm:text-4xl">
          Compare
        </h1>
        <p className="mt-2 text-ink-500">
          Weigh your options side by side to decide with confidence.
        </p>
      </header>

      <div className="mb-7 flex flex-wrap items-center justify-between gap-3">
        <div className="overflow-x-auto no-scrollbar">
          <Tabs tabs={tabs} value={tab} onChange={setTab} />
        </div>
        {compare[tab].length > 0 && (
          <button
            onClick={() => clearCompare(tab)}
            className="text-sm font-medium text-ink-500 hover:text-ink-800"
          >
            Clear {tab}s
          </button>
        )}
      </div>

      {loading ? (
        <Skeleton className="h-96 w-full rounded-2xl" />
      ) : (
        <ComparePane
          type={tab}
          data={data}
          selectedIds={compare[tab]}
          onRemove={(id) => toggleCompare(tab, id)}
        />
      )}
    </div>
  );
}

function ComparePane({ type, data, selectedIds, onRemove }) {
  const source = {
    hospital: data.hospitals,
    doctor: data.doctors,
    treatment: data.treatments,
  }[type];
  const items = selectedIds
    .map((id) => source.find((x) => x.id === id))
    .filter(Boolean);

  if (items.length === 0) {
    return (
      <EmptyState
        icon="scale"
        title={`No ${type}s selected`}
        description={`Tap “Compare” on any ${type} to add it here. You can compare up to four.`}
        action={<Button to={`/${type}s`}>Browse {type}s</Button>}
      />
    );
  }

  const rows = ROWS[type](data);

  return (
    <div className="overflow-x-auto rounded-2xl border border-ink-100">
      <table className="w-full border-collapse bg-white">
        <thead>
          <tr>
            <th className="sticky left-0 z-10 w-40 bg-ink-50 p-4 text-left align-bottom" />
            {items.map((item) => (
              <th key={item.id} className="min-w-[220px] border-l border-ink-100 p-4 align-top">
                <div className="relative">
                  <button
                    onClick={() => onRemove(item.id)}
                    className="absolute -right-1 -top-1 flex h-6 w-6 items-center justify-center rounded-full bg-ink-100 text-ink-600 hover:bg-ink-200"
                    aria-label="Remove"
                  >
                    <Icon name="x" size={14} />
                  </button>
                  <SmartImage
                    src={type === 'doctor' ? item.image : item.thumbnail || item.image}
                    alt={item.name}
                    aspect="aspect-[4/3]"
                    rounded="rounded-xl"
                    imgClassName={type === 'doctor' ? 'object-top' : ''}
                  />
                  <Link
                    to={`/${type}s/${item.id}`}
                    className="mt-3 block text-left font-semibold text-ink-900 hover:text-brand-700"
                  >
                    {item.name}
                  </Link>
                </div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.label} className="border-t border-ink-100">
              <td className="sticky left-0 z-10 bg-ink-50 p-4 text-sm font-medium text-ink-600">
                {row.label}
              </td>
              {items.map((item) => (
                <td key={item.id} className="border-l border-ink-100 p-4 align-top text-sm text-ink-800">
                  {row.render(item)}
                </td>
              ))}
            </tr>
          ))}
          <tr className="border-t border-ink-100">
            <td className="sticky left-0 z-10 bg-ink-50 p-4" />
            {items.map((item) => (
              <td key={item.id} className="border-l border-ink-100 p-4">
                <Button size="sm" fullWidth to={`/${type}s/${item.id}`}>
                  View details
                </Button>
              </td>
            ))}
          </tr>
        </tbody>
      </table>
    </div>
  );
}

// Row definitions per entity type. `data` is passed so we can resolve refs.
const ROWS = {
  hospital: () => [
    { label: 'Rating', render: (h) => <Rating value={h.rating} count={h.reviewCount} /> },
    { label: 'Type', render: (h) => <span className="capitalize">{h.type}</span> },
    { label: 'Location', render: (h) => `${h.city}, ${h.state}` },
    { label: 'Established', render: (h) => h.establishedYear },
    { label: 'Beds', render: (h) => h.beds },
    { label: 'Specialties', render: (h) => h.specialties.join(', ') },
    { label: 'Facilities', render: (h) => `${h.facilities.length} listed` },
    { label: 'Accreditations', render: (h) => h.accreditations.join(', ') },
    {
      label: 'International support',
      render: (h) => (h.internationalSupport ? <Yes /> : <No />),
    },
    { label: 'Price range', render: (h) => formatPriceRange(h.priceRange) },
    { label: 'Languages', render: (h) => h.languages.join(', ') },
  ],
  doctor: (data) => [
    { label: 'Rating', render: (d) => <Rating value={d.rating} count={d.reviewCount} /> },
    { label: 'Specialty', render: (d) => d.specialty },
    { label: 'Experience', render: (d) => `${d.experienceYears} years` },
    {
      label: 'Hospital',
      render: (d) => data.hospitals.find((h) => h.id === d.hospitalId)?.name || '—',
    },
    { label: 'Location', render: (d) => d.city },
    { label: 'Availability', render: (d) => <StatusBadge status={d.availability} /> },
    { label: 'Next available', render: (d) => d.nextAvailable },
    { label: 'Languages', render: (d) => d.languages.join(', ') },
    { label: 'Consultation fee', render: (d) => formatPriceRange(d.consultationFee) },
  ],
  treatment: () => [
    { label: 'Category', render: (t) => t.category },
    { label: 'Estimated cost', render: (t) => formatPriceRange(t.cost) },
    { label: 'Time in India', render: (t) => t.duration },
    { label: 'Hospital stay', render: (t) => t.hospitalStay },
    { label: 'Recovery', render: (t) => t.recovery },
    { label: 'Hospitals', render: (t) => `${t.hospitalIds.length} available` },
    { label: 'Specialists', render: (t) => `${t.doctorIds.length} available` },
  ],
};

const Yes = () => (
  <span className="inline-flex items-center gap-1 text-emerald-600">
    <Icon name="check" size={16} /> Yes
  </span>
);
const No = () => (
  <span className="inline-flex items-center gap-1 text-ink-400">
    <Icon name="x" size={16} /> No
  </span>
);
