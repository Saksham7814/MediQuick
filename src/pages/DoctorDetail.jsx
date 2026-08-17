import { Link, useParams } from 'react-router-dom';
import SmartImage from '../components/ui/SmartImage.jsx';
import Rating from '../components/ui/Rating.jsx';
import Badge, { StatusBadge } from '../components/ui/Badge.jsx';
import Icon from '../components/ui/Icon.jsx';
import Button from '../components/ui/Button.jsx';
import SaveButton from '../components/ui/SaveButton.jsx';
import CompareButton from '../components/ui/CompareButton.jsx';
import { ErrorState } from '../components/ui/States.jsx';
import { Breadcrumb, Section, DetailSkeleton } from '../components/detail/DetailBits.jsx';
import { useAsync } from '../hooks/useAsync.js';
import {
  getDoctorById,
  getHospitalById,
  getTreatmentsByIds,
} from '../services/api.js';
import { formatPriceRange } from '../utils/format.js';

export default function DoctorDetail() {
  const { id } = useParams();

  const load = async () => {
    const doctor = await getDoctorById(id);
    const [hospital, treatments] = await Promise.all([
      getHospitalById(doctor.hospitalId).catch(() => null),
      getTreatmentsByIds(doctor.treatmentIds),
    ]);
    return { doctor, hospital, treatments };
  };

  const { data, loading, error, retry } = useAsync(load, [id]);

  if (loading) return <DetailSkeleton />;
  if (error)
    return (
      <div className="container-content py-16">
        <ErrorState
          title="Doctor not found"
          description="This profile may have been moved or is unavailable."
          onRetry={retry}
        />
        <div className="mt-6 text-center">
          <Button variant="outline" to="/doctors">
            Back to doctors
          </Button>
        </div>
      </div>
    );

  const { doctor, hospital, treatments } = data;

  return (
    <div className="container-content py-8">
      <Breadcrumb
        trail={[{ to: '/doctors', label: 'Doctors' }, { label: doctor.name }]}
      />

      <div className="grid gap-10 lg:grid-cols-[1fr_20rem]">
        <div>
          {/* Header */}
          <div className="flex flex-col gap-5 sm:flex-row sm:items-start">
            <SmartImage
              src={doctor.image}
              alt={doctor.name}
              aspect="aspect-square"
              rounded="rounded-2xl"
              className="w-full max-w-[180px] shrink-0"
              imgClassName="object-top"
            />
            <div className="flex-1">
              <div className="mb-2">
                <StatusBadge status={doctor.availability} />
              </div>
              <h1 className="font-display text-3xl font-semibold text-ink-900">
                {doctor.name}
              </h1>
              <p className="mt-1 text-lg font-medium text-brand-700">
                {doctor.specialty}
              </p>
              <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1.5 text-sm text-ink-500">
                <Rating value={doctor.rating} count={doctor.reviewCount} />
                <span className="flex items-center gap-1.5">
                  <Icon name="award" size={15} /> {doctor.experienceYears} yrs experience
                </span>
                <span className="flex items-center gap-1.5">
                  <Icon name="mapPin" size={15} /> {doctor.city}
                </span>
              </div>
              {hospital && (
                <Link
                  to={`/hospitals/${hospital.id}`}
                  className="mt-3 inline-flex items-center gap-1.5 text-sm font-medium text-ink-700 hover:text-brand-700"
                >
                  <Icon name="building" size={15} /> {hospital.name}
                  <Icon name="chevronRight" size={14} />
                </Link>
              )}
              <div className="mt-4 flex gap-2">
                <SaveButton type="doctor" id={doctor.id} />
                <CompareButton type="doctor" id={doctor.id} />
              </div>
            </div>
          </div>

          <Section title="About">
            <p className="leading-relaxed text-ink-600">{doctor.about}</p>
          </Section>

          <Section title="Qualifications">
            <ul className="space-y-2.5">
              {doctor.qualifications.map((q) => (
                <li key={q} className="flex items-center gap-2 text-ink-600">
                  <Icon name="award" size={18} className="text-brand-600" />
                  {q}
                </li>
              ))}
            </ul>
          </Section>

          <Section title="Areas of expertise">
            <div className="flex flex-wrap gap-2">
              {doctor.expertise.map((e) => (
                <Badge key={e} tone="brand">
                  {e}
                </Badge>
              ))}
            </div>
          </Section>

          <Section title="Languages spoken">
            <div className="flex flex-wrap gap-2">
              {doctor.languages.map((l) => (
                <Badge key={l} tone="outline">
                  <Icon name="languages" size={13} /> {l}
                </Badge>
              ))}
            </div>
          </Section>

          {treatments.length > 0 && (
            <Section title="Treatments offered">
              <div className="divide-y divide-ink-100 overflow-hidden rounded-2xl border border-ink-100">
                {treatments.map((t) => (
                  <Link
                    key={t.id}
                    to={`/treatments/${t.id}`}
                    className="flex items-center justify-between gap-4 p-4 transition-colors hover:bg-ink-50"
                  >
                    <div>
                      <p className="font-medium text-ink-900">{t.name}</p>
                      <p className="text-sm text-ink-500">{t.category}</p>
                    </div>
                    <p className="text-sm font-semibold text-ink-900">
                      {formatPriceRange(t.cost)}
                    </p>
                  </Link>
                ))}
              </div>
            </Section>
          )}
        </div>

        {/* Sidebar */}
        <aside className="lg:sticky lg:top-20 lg:self-start">
          <div className="rounded-2xl border border-ink-100 bg-white p-6 shadow-card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-ink-500">Consultation fee</p>
                <p className="mt-1 font-display text-2xl font-semibold text-ink-900">
                  {formatPriceRange(doctor.consultationFee)}
                </p>
              </div>
              <StatusBadge status={doctor.availability} />
            </div>
            <p className="mt-3 flex items-center gap-2 rounded-xl bg-ink-50 px-3 py-2.5 text-sm text-ink-600">
              <Icon name="calendar" size={16} className="text-brand-600" />
              Next available: <span className="font-medium text-ink-900">{doctor.nextAvailable}</span>
            </p>

            <Button
              to={`/consultation?doctor=${doctor.id}`}
              fullWidth
              size="lg"
              className="mt-5"
            >
              Request consultation
            </Button>
            <div className="mt-3 flex gap-2">
              <SaveButton type="doctor" id={doctor.id} className="flex-1" />
              <CompareButton type="doctor" id={doctor.id} className="flex-1" />
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
