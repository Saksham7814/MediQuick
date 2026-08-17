import { Link, useLocation } from 'react-router-dom';
import Button from '../components/ui/Button.jsx';
import Icon from '../components/ui/Icon.jsx';
import { StatusBadge } from '../components/ui/Badge.jsx';
import { EmptyState } from '../components/ui/States.jsx';
import { CONSULTATION_STATUSES } from '../data/models.js';
import { formatDate } from '../utils/format.js';

export default function ConsultationConfirmation() {
  const { state } = useLocation();

  if (!state?.request) {
    return (
      <div className="container-content max-w-2xl py-16">
        <EmptyState
          icon="info"
          title="No request to show"
          description="Submit a consultation request to see its confirmation here."
          action={<Button to="/consultation">Request a consultation</Button>}
        />
      </div>
    );
  }

  const { request, treatmentName, hospitalName, doctorName } = state;
  // The "Cancelled" branch is shown separately, so the linear stepper covers
  // Pending → Processing → Confirmed.
  const steps = CONSULTATION_STATUSES.filter((s) => s !== 'Cancelled');
  const currentIndex = steps.indexOf(request.status);

  return (
    <div className="container-content max-w-2xl py-12">
      {/* Success header */}
      <div className="text-center">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-brand-50 text-brand-600 animate-scale-in">
          <Icon name="checkCircle" size={34} />
        </div>
        <h1 className="mt-5 font-display text-3xl font-semibold text-ink-900">
          Request received
        </h1>
        <p className="mt-2 text-ink-500">
          Thank you{request.fullName ? `, ${request.fullName.split(' ')[0]}` : ''}. Our
          care team will review your request and reach out shortly.
        </p>
      </div>

      {/* Summary card */}
      <div className="mt-8 overflow-hidden rounded-2xl border border-ink-100 bg-white shadow-card">
        <div className="flex items-center justify-between border-b border-ink-100 bg-ink-50/60 px-6 py-4">
          <div>
            <p className="text-xs text-ink-500">Request ID</p>
            <p className="font-mono text-lg font-semibold tracking-tight text-ink-900">
              {request.id}
            </p>
          </div>
          <StatusBadge status={request.status} />
        </div>

        <dl className="divide-y divide-ink-100">
          <SummaryRow label="Treatment" value={treatmentName || '—'} />
          {hospitalName && <SummaryRow label="Preferred hospital" value={hospitalName} />}
          {doctorName && <SummaryRow label="Preferred doctor" value={doctorName} />}
          <SummaryRow
            label="Requested date"
            value={`${formatDate(request.preferredDate)} · ${request.preferredTime}`}
          />
          <SummaryRow label="Contact" value={request.email} />
        </dl>
      </div>

      {/* Status stepper */}
      <div className="mt-8">
        <h2 className="mb-4 text-sm font-semibold uppercase tracking-wide text-ink-500">
          What happens next
        </h2>
        <ol className="relative">
          {steps.map((step, i) => {
            const done = i < currentIndex;
            const active = i === currentIndex;
            return (
              <li key={step} className="flex gap-4 pb-6 last:pb-0">
                <div className="flex flex-col items-center">
                  <span
                    className={
                      'flex h-9 w-9 items-center justify-center rounded-full border-2 text-sm font-semibold ' +
                      (done
                        ? 'border-brand-600 bg-brand-600 text-white'
                        : active
                        ? 'border-brand-600 bg-white text-brand-700'
                        : 'border-ink-200 bg-white text-ink-400')
                    }
                  >
                    {done ? <Icon name="check" size={16} /> : i + 1}
                  </span>
                  {i < steps.length - 1 && (
                    <span
                      className={
                        'mt-1 w-0.5 flex-1 ' + (done ? 'bg-brand-600' : 'bg-ink-200')
                      }
                    />
                  )}
                </div>
                <div className="pb-2 pt-1">
                  <p
                    className={
                      'font-semibold ' + (active || done ? 'text-ink-900' : 'text-ink-400')
                    }
                  >
                    {step}
                    {active && (
                      <span className="ml-2 text-xs font-medium text-brand-700">
                        Current
                      </span>
                    )}
                  </p>
                  <p className="text-sm text-ink-500">{STEP_COPY[step]}</p>
                </div>
              </li>
            );
          })}
        </ol>
      </div>

      <div className="mt-6 flex flex-col gap-3 sm:flex-row">
        <Button to="/consultations" fullWidth>
          View my requests
        </Button>
        <Button to="/explore" variant="outline" fullWidth>
          Keep exploring
        </Button>
      </div>

      <p className="mt-6 text-center text-sm text-ink-500">
        Need to talk to us?{' '}
        <Link to="/messages" className="font-medium text-brand-700 hover:underline">
          Message our care team
        </Link>
        .
      </p>
    </div>
  );
}

const STEP_COPY = {
  Pending: 'We’ve received your request and it’s in the queue.',
  Processing: 'Our team is matching you with the right hospital and specialist.',
  Confirmed: 'Your consultation is confirmed and details are on the way.',
};

function SummaryRow({ label, value }) {
  return (
    <div className="flex items-center justify-between gap-4 px-6 py-3.5">
      <dt className="text-sm text-ink-500">{label}</dt>
      <dd className="text-right text-sm font-medium text-ink-900">{value}</dd>
    </div>
  );
}
