import { useParams } from 'react-router-dom';
import SmartImage from '../components/ui/SmartImage.jsx';
import Badge from '../components/ui/Badge.jsx';
import Icon from '../components/ui/Icon.jsx';
import Button from '../components/ui/Button.jsx';
import SaveButton from '../components/ui/SaveButton.jsx';
import CompareButton from '../components/ui/CompareButton.jsx';
import HospitalCard from '../components/cards/HospitalCard.jsx';
import DoctorCard from '../components/cards/DoctorCard.jsx';
import { ErrorState } from '../components/ui/States.jsx';
import { Breadcrumb, Section, DetailSkeleton } from '../components/detail/DetailBits.jsx';
import { useAsync } from '../hooks/useAsync.js';
import {
  getTreatmentById,
  getHospitalsByIds,
  getDoctorsByIds,
} from '../services/api.js';
import { formatPriceRange } from '../utils/format.js';

export default function TreatmentDetail() {
  const { id } = useParams();

  const load = async () => {
    const treatment = await getTreatmentById(id);
    const [hospitals, doctors] = await Promise.all([
      getHospitalsByIds(treatment.hospitalIds),
      getDoctorsByIds(treatment.doctorIds),
    ]);
    return { treatment, hospitals, doctors };
  };

  const { data, loading, error, retry } = useAsync(load, [id]);

  if (loading) return <DetailSkeleton />;
  if (error)
    return (
      <div className="container-content py-16">
        <ErrorState
          title="Treatment not found"
          description="This treatment may have been moved or is unavailable."
          onRetry={retry}
        />
        <div className="mt-6 text-center">
          <Button variant="outline" to="/treatments">
            Back to treatments
          </Button>
        </div>
      </div>
    );

  const { treatment, hospitals, doctors } = data;
  const hospitalName = (hId) => hospitals.find((h) => h.id === hId)?.name;

  return (
    <div className="container-content py-8">
      <Breadcrumb
        trail={[
          { to: '/treatments', label: 'Treatments' },
          { label: treatment.name },
        ]}
      />

      <div className="grid gap-10 lg:grid-cols-[1fr_20rem]">
        <div>
          <div className="mb-5 overflow-hidden rounded-2xl">
            <SmartImage
              src={treatment.image}
              alt={treatment.name}
              aspect="aspect-[16/9]"
            />
          </div>

          <Badge tone="brand">{treatment.category}</Badge>
          <h1 className="mt-3 font-display text-3xl font-semibold text-ink-900 sm:text-4xl">
            {treatment.name}
          </h1>
          <p className="mt-2 text-lg text-ink-500">{treatment.shortDescription}</p>

          <div className="mt-5 flex gap-2 lg:hidden">
            <SaveButton type="treatment" id={treatment.id} />
            <CompareButton type="treatment" id={treatment.id} />
          </div>

          <Section title="Overview">
            <p className="leading-relaxed text-ink-600">{treatment.overview}</p>
          </Section>

          <Section title="The procedure">
            <p className="leading-relaxed text-ink-600">{treatment.procedure}</p>
          </Section>

          <Section title="What to expect">
            <div className="grid gap-3 sm:grid-cols-3">
              <InfoTile icon="clock" label="Time in India" value={treatment.duration} />
              <InfoTile icon="bed" label="Hospital stay" value={treatment.hospitalStay} />
              <InfoTile icon="shield" label="Recovery" value={treatment.recovery} />
            </div>
          </Section>

          <Section title="What's included">
            <ul className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
              {treatment.includes.map((item) => (
                <li key={item} className="flex items-start gap-2 text-ink-600">
                  <Icon name="checkCircle" size={18} className="mt-0.5 shrink-0 text-brand-600" />
                  {item}
                </li>
              ))}
            </ul>
          </Section>

          {hospitals.length > 0 && (
            <Section title="Available at these hospitals">
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                {hospitals.map((h) => (
                  <HospitalCard key={h.id} hospital={h} />
                ))}
              </div>
            </Section>
          )}

          {doctors.length > 0 && (
            <Section title="Specialists for this treatment">
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                {doctors.map((d) => (
                  <DoctorCard key={d.id} doctor={d} hospitalName={hospitalName(d.hospitalId)} />
                ))}
              </div>
            </Section>
          )}
        </div>

        {/* Sidebar */}
        <aside className="lg:sticky lg:top-20 lg:self-start">
          <div className="rounded-2xl border border-ink-100 bg-white p-6 shadow-card">
            <p className="text-sm text-ink-500">Estimated cost</p>
            <p className="mt-1 font-display text-2xl font-semibold text-ink-900">
              {formatPriceRange(treatment.cost)}
            </p>
            <p className="mt-1 text-xs text-ink-500">
              All-inclusive estimate. Final quote after consultation.
            </p>

            <div className="mt-4 space-y-2.5 border-y border-ink-100 py-4 text-sm">
              <Row icon="clock" label="Duration" value={treatment.duration} />
              <Row icon="building" label="Hospitals" value={`${treatment.hospitalIds.length} available`} />
              <Row icon="stethoscope" label="Specialists" value={`${treatment.doctorIds.length} available`} />
            </div>

            <Button
              to={`/consultation?treatment=${treatment.id}`}
              fullWidth
              size="lg"
              className="mt-5"
            >
              Request consultation
            </Button>
            <div className="mt-3 flex gap-2">
              <SaveButton type="treatment" id={treatment.id} className="flex-1" />
              <CompareButton type="treatment" id={treatment.id} className="flex-1" />
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}

function InfoTile({ icon, label, value }) {
  return (
    <div className="rounded-xl border border-ink-100 bg-white p-4">
      <Icon name={icon} size={18} className="text-brand-600" />
      <p className="mt-2 text-xs text-ink-500">{label}</p>
      <p className="mt-0.5 font-medium text-ink-900">{value}</p>
    </div>
  );
}

function Row({ icon, label, value }) {
  return (
    <div className="flex items-center justify-between">
      <span className="flex items-center gap-2 text-ink-500">
        <Icon name={icon} size={16} className="text-brand-600" />
        {label}
      </span>
      <span className="font-medium text-ink-900">{value}</span>
    </div>
  );
}
