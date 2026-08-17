import { useState } from 'react';
import Button from '../components/ui/Button.jsx';
import Icon from '../components/ui/Icon.jsx';
import { StatusBadge } from '../components/ui/Badge.jsx';
import { EmptyState, ErrorState } from '../components/ui/States.jsx';
import { Skeleton } from '../components/ui/Skeleton.jsx';
import { useAsync } from '../hooks/useAsync.js';
import {
  getConsultationRequests,
  getDoctors,
  getHospitals,
  getTreatments,
} from '../services/api.js';
import { formatDate, timeAgo } from '../utils/format.js';

const load = () =>
  Promise.all([
    getConsultationRequests(),
    getDoctors(),
    getHospitals(),
    getTreatments(),
  ]).then(([requests, doctors, hospitals, treatments]) => ({
    requests,
    doctors,
    hospitals,
    treatments,
  }));

export default function ConsultationRequests() {
  const { data, loading, error, retry } = useAsync(load, []);
  const [expanded, setExpanded] = useState(null);

  const name = (list, id) => (list || []).find((x) => x.id === id)?.name;

  return (
    <div className="container-content max-w-4xl py-10">
      <header className="mb-6 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl font-semibold text-ink-900 sm:text-4xl">
            Consultation requests
          </h1>
          <p className="mt-2 text-ink-500">
            Track the status of every consultation you’ve requested.
          </p>
        </div>
        <Button to="/consultation" size="sm">
          <Icon name="plus" size={16} />
          New request
        </Button>
      </header>

      {loading ? (
        <div className="space-y-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-32 w-full rounded-2xl" />
          ))}
        </div>
      ) : error ? (
        <ErrorState description="We couldn't load your requests." onRetry={retry} />
      ) : data.requests.length === 0 ? (
        <EmptyState
          icon="stethoscope"
          title="No consultation requests yet"
          description="When you request a consultation, it will appear here so you can track its status."
          action={<Button to="/consultation">Request a consultation</Button>}
        />
      ) : (
        <div className="space-y-4">
          {data.requests.map((r) => {
            const isOpen = expanded === r.id;
            return (
              <div
                key={r.id}
                className="overflow-hidden rounded-2xl border border-ink-100 bg-white shadow-card"
              >
                <button
                  onClick={() => setExpanded(isOpen ? null : r.id)}
                  className="flex w-full items-center gap-4 p-5 text-left transition-colors hover:bg-ink-50/60"
                >
                  <span className="hidden h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-brand-50 text-brand-700 sm:flex">
                    <Icon name="stethoscope" size={20} />
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-mono text-sm font-semibold text-ink-900">
                        {r.id}
                      </span>
                      <StatusBadge status={r.status} />
                    </div>
                    <p className="mt-1 truncate font-medium text-ink-900">
                      {name(data.treatments, r.treatmentId) || 'Treatment'}
                    </p>
                    <p className="text-sm text-ink-500">
                      Requested {timeAgo(r.createdAt)}
                    </p>
                  </div>
                  <Icon
                    name="chevronDown"
                    size={20}
                    className={
                      'shrink-0 text-ink-400 transition-transform ' +
                      (isOpen ? 'rotate-180' : '')
                    }
                  />
                </button>

                {isOpen && (
                  <div className="border-t border-ink-100 bg-ink-50/40 p-5 animate-fade-in">
                    <dl className="grid gap-x-6 gap-y-3 sm:grid-cols-2">
                      <Detail label="Treatment" value={name(data.treatments, r.treatmentId)} />
                      <Detail label="Preferred hospital" value={name(data.hospitals, r.hospitalId) || 'No preference'} />
                      <Detail label="Preferred doctor" value={name(data.doctors, r.doctorId) || 'No preference'} />
                      <Detail
                        label="Preferred date"
                        value={`${formatDate(r.preferredDate)} · ${r.preferredTime}`}
                      />
                      <Detail label="Contact" value={r.email} />
                      <Detail label="Phone" value={r.phone} />
                    </dl>
                    <div className="mt-4">
                      <p className="text-sm font-medium text-ink-600">Your message</p>
                      <p className="mt-1 rounded-xl border border-ink-100 bg-white p-3.5 text-sm leading-relaxed text-ink-700">
                        {r.message}
                      </p>
                    </div>
                    <div className="mt-4 flex gap-2">
                      <Button size="sm" variant="outline" to="/messages">
                        <Icon name="message" size={15} /> Message care team
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

function Detail({ label, value }) {
  return (
    <div>
      <dt className="text-xs text-ink-500">{label}</dt>
      <dd className="text-sm font-medium text-ink-900">{value || '—'}</dd>
    </div>
  );
}
