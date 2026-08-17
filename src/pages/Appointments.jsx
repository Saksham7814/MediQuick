import { useState } from 'react';
import Tabs from '../components/ui/Tabs.jsx';
import Button from '../components/ui/Button.jsx';
import Icon from '../components/ui/Icon.jsx';
import { StatusBadge } from '../components/ui/Badge.jsx';
import { EmptyState, ErrorState } from '../components/ui/States.jsx';
import { Skeleton } from '../components/ui/Skeleton.jsx';
import { useAsync } from '../hooks/useAsync.js';
import {
  getAppointments,
  getDoctors,
  getHospitals,
  getTreatments,
} from '../services/api.js';
import { formatDate } from '../utils/format.js';

const load = () =>
  Promise.all([
    getAppointments(),
    getDoctors(),
    getHospitals(),
    getTreatments(),
  ]).then(([appointments, doctors, hospitals, treatments]) => ({
    appointments,
    doctors,
    hospitals,
    treatments,
  }));

export default function Appointments() {
  const { data, loading, error, retry } = useAsync(load, []);
  const [tab, setTab] = useState('upcoming');

  const appts = data?.appointments || [];
  const counts = {
    upcoming: appts.filter((a) => a.status === 'upcoming').length,
    past: appts.filter((a) => a.status === 'past').length,
    cancelled: appts.filter((a) => a.status === 'cancelled').length,
  };
  const tabs = [
    { value: 'upcoming', label: 'Upcoming', count: counts.upcoming },
    { value: 'past', label: 'Past', count: counts.past },
    { value: 'cancelled', label: 'Cancelled', count: counts.cancelled },
  ];

  const visible = appts.filter((a) => a.status === tab);
  const lookup = (list, id) => (list || []).find((x) => x.id === id);

  return (
    <div className="container-content py-10">
      <header className="mb-6">
        <h1 className="font-display text-3xl font-semibold text-ink-900 sm:text-4xl">
          Appointments
        </h1>
        <p className="mt-2 text-ink-500">
          Your consultations and treatment appointments in one place.
        </p>
      </header>

      <div className="mb-7 overflow-x-auto no-scrollbar">
        <Tabs tabs={tabs} value={tab} onChange={setTab} />
      </div>

      {loading ? (
        <div className="space-y-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-28 w-full rounded-2xl" />
          ))}
        </div>
      ) : error ? (
        <ErrorState description="We couldn't load your appointments." onRetry={retry} />
      ) : visible.length === 0 ? (
        <EmptyState
          icon="calendar"
          title={`No ${tab} appointments`}
          description={
            tab === 'upcoming'
              ? 'Request a consultation to book your first appointment.'
              : `You have no ${tab} appointments.`
          }
          action={tab === 'upcoming' ? <Button to="/consultation">Request consultation</Button> : null}
        />
      ) : (
        <div className="space-y-4">
          {visible.map((a) => {
            const doctor = lookup(data.doctors, a.doctorId);
            const hospital = lookup(data.hospitals, a.hospitalId);
            const treatment = lookup(data.treatments, a.treatmentId);
            return (
              <AppointmentCard
                key={a.id}
                appointment={a}
                doctor={doctor}
                hospital={hospital}
                treatment={treatment}
              />
            );
          })}
        </div>
      )}
    </div>
  );
}

function AppointmentCard({ appointment, doctor, hospital, treatment }) {
  return (
    <div className="flex flex-col gap-4 rounded-2xl border border-ink-100 bg-white p-5 shadow-card sm:flex-row sm:items-center">
      {doctor && (
        <img
          src={doctor.image}
          alt={doctor.name}
          className="h-14 w-14 shrink-0 rounded-full object-cover object-top"
        />
      )}
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <h3 className="font-semibold text-ink-900">{doctor?.name || 'Doctor'}</h3>
          <StatusBadge status={appointment.status} />
        </div>
        <p className="text-sm text-brand-700">{doctor?.specialty}</p>
        <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-sm text-ink-500">
          <span className="flex items-center gap-1.5">
            <Icon name="sparkles" size={14} /> {treatment?.name || '—'}
          </span>
          <span className="flex items-center gap-1.5">
            <Icon name="building" size={14} /> {hospital?.name || '—'}
          </span>
        </div>
      </div>
      <div className="flex items-center justify-between gap-5 border-t border-ink-100 pt-4 sm:flex-col sm:items-end sm:border-0 sm:pt-0 sm:text-right">
        <div>
          <p className="flex items-center gap-1.5 text-sm font-medium text-ink-900">
            <Icon name="calendar" size={15} className="text-brand-600" />
            {formatDate(appointment.date)}
          </p>
          <p className="mt-0.5 flex items-center gap-1.5 text-sm text-ink-500 sm:justify-end">
            <Icon name={appointment.mode === 'video' ? 'message' : 'mapPin'} size={14} />
            {appointment.time}
          </p>
        </div>
        <span className="rounded-full bg-ink-100 px-2.5 py-0.5 text-xs font-medium capitalize text-ink-600">
          {appointment.mode === 'video' ? 'Video consult' : 'In-person'}
        </span>
      </div>
    </div>
  );
}
