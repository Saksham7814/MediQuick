import { Link, useParams } from 'react-router-dom';
import Gallery from '../components/ui/Gallery.jsx';
import Rating from '../components/ui/Rating.jsx';
import Badge from '../components/ui/Badge.jsx';
import Icon from '../components/ui/Icon.jsx';
import Button from '../components/ui/Button.jsx';
import SaveButton from '../components/ui/SaveButton.jsx';
import CompareButton from '../components/ui/CompareButton.jsx';
import DoctorCard from '../components/cards/DoctorCard.jsx';
import { ErrorState } from '../components/ui/States.jsx';
import {
  Breadcrumb,
  Section,
  QuickFacts,
  DetailSkeleton,
} from '../components/detail/DetailBits.jsx';
import { useAsync } from '../hooks/useAsync.js';
import {
  getHospitalById,
  getDoctorsByIds,
  getTreatmentsByIds,
} from '../services/api.js';
import { formatPriceRange } from '../utils/format.js';

export default function HospitalDetail() {
  const { id } = useParams();

  const load = async () => {
    const hospital = await getHospitalById(id);
    const [doctors, treatments] = await Promise.all([
      getDoctorsByIds(hospital.doctorIds),
      getTreatmentsByIds(hospital.treatmentIds),
    ]);
    return { hospital, doctors, treatments };
  };

  const { data, loading, error, retry } = useAsync(load, [id]);

  if (loading) return <DetailSkeleton withGallery />;
  if (error)
    return (
      <div className="container-content py-16">
        <ErrorState
          title="Hospital not found"
          description="This hospital may have been moved or is unavailable."
          onRetry={retry}
        />
        <div className="mt-6 text-center">
          <Button variant="outline" to="/hospitals">
            Back to hospitals
          </Button>
        </div>
      </div>
    );

  const { hospital, doctors, treatments } = data;

  return (
    <div className="container-content py-8">
      <Breadcrumb
        trail={[
          { to: '/hospitals', label: 'Hospitals' },
          { label: hospital.name },
        ]}
      />

      <div className="mb-6">
        <Gallery images={hospital.images} alt={hospital.name} />
      </div>

      <div className="grid gap-10 lg:grid-cols-[1fr_20rem]">
        {/* Main column */}
        <div>
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <div className="mb-2 flex flex-wrap items-center gap-2">
                <Badge tone="brand" className="capitalize">
                  {hospital.type}
                </Badge>
                {hospital.internationalSupport && (
                  <Badge tone="green">
                    <Icon name="globe" size={12} /> International patients
                  </Badge>
                )}
              </div>
              <h1 className="font-display text-3xl font-semibold text-ink-900 sm:text-4xl">
                {hospital.name}
              </h1>
              <p className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-ink-500">
                <span className="flex items-center gap-1.5">
                  <Icon name="mapPin" size={16} />
                  {hospital.city}, {hospital.state}
                </span>
                <Rating value={hospital.rating} count={hospital.reviewCount} />
              </p>
            </div>
            <div className="flex gap-2">
              <SaveButton type="hospital" id={hospital.id} />
              <CompareButton type="hospital" id={hospital.id} />
            </div>
          </div>

          <QuickFacts
            facts={[
              { icon: 'calendar', label: 'Established', value: hospital.establishedYear },
              { icon: 'bed', label: 'Beds', value: hospital.beds },
              { icon: 'star', label: 'Rating', value: hospital.rating.toFixed(1) },
              {
                icon: 'languages',
                label: 'Languages',
                value: `${hospital.languages.length}+`,
              },
            ]}
          />

          <Section title="About">
            <p className="leading-relaxed text-ink-600">{hospital.about}</p>
          </Section>

          <Section title="Accreditations">
            <div className="flex flex-wrap gap-2">
              {hospital.accreditations.map((a) => (
                <Badge key={a} tone="outline">
                  <Icon name="shield" size={13} className="text-brand-600" />
                  {a}
                </Badge>
              ))}
            </div>
          </Section>

          <Section title="Specialties">
            <div className="flex flex-wrap gap-2">
              {hospital.specialties.map((s) => (
                <Badge key={s} tone="brand">
                  {s}
                </Badge>
              ))}
            </div>
          </Section>

          <Section title="Facilities">
            <ul className="grid grid-cols-1 gap-x-6 gap-y-2.5 sm:grid-cols-2">
              {hospital.facilities.map((f) => (
                <li key={f} className="flex items-center gap-2 text-ink-600">
                  <Icon name="checkCircle" size={18} className="text-brand-600" />
                  {f}
                </li>
              ))}
            </ul>
          </Section>

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
                  <div className="text-right">
                    <p className="text-sm font-semibold text-ink-900">
                      {formatPriceRange(t.cost)}
                    </p>
                    <span className="text-xs text-brand-700">View details →</span>
                  </div>
                </Link>
              ))}
            </div>
          </Section>

          {doctors.length > 0 && (
            <Section title="Doctors at this hospital">
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                {doctors.map((d) => (
                  <DoctorCard key={d.id} doctor={d} hospitalName={hospital.name} />
                ))}
              </div>
            </Section>
          )}

          <Section title="International patient support">
            <div className="rounded-2xl border border-brand-100 bg-brand-50/50 p-5">
              <ul className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
                {hospital.internationalServices.map((s) => (
                  <li key={s} className="flex items-start gap-2 text-ink-700">
                    <Icon name="check" size={18} className="mt-0.5 shrink-0 text-brand-600" />
                    {s}
                  </li>
                ))}
              </ul>
            </div>
          </Section>
        </div>

        {/* Sticky sidebar */}
        <aside className="lg:sticky lg:top-20 lg:self-start">
          <div className="rounded-2xl border border-ink-100 bg-white p-6 shadow-card">
            <p className="text-sm text-ink-500">Estimated treatment cost</p>
            <p className="mt-1 font-display text-2xl font-semibold text-ink-900">
              {formatPriceRange(hospital.priceRange)}
            </p>
            <p className="mt-1 text-xs text-ink-500">
              Final estimate shared after consultation.
            </p>

            <Button
              to={`/consultation?hospital=${hospital.id}`}
              fullWidth
              size="lg"
              className="mt-5"
            >
              Request consultation
            </Button>
            <div className="mt-3 flex gap-2">
              <SaveButton type="hospital" id={hospital.id} className="flex-1" />
              <CompareButton type="hospital" id={hospital.id} className="flex-1" />
            </div>

            <div className="mt-5 space-y-2.5 border-t border-ink-100 pt-5 text-sm text-ink-600">
              <p className="flex items-center gap-2">
                <Icon name="globe" size={16} className="text-brand-600" />
                {hospital.languages.join(', ')}
              </p>
              <p className="flex items-center gap-2">
                <Icon name="shield" size={16} className="text-brand-600" />
                {hospital.accreditations.join(' · ')}
              </p>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}

