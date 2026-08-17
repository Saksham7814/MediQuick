import { Link } from 'react-router-dom';
import SectionHeader from '../components/ui/SectionHeader.jsx';
import HospitalCard from '../components/cards/HospitalCard.jsx';
import DoctorCard from '../components/cards/DoctorCard.jsx';
import Button from '../components/ui/Button.jsx';
import Icon from '../components/ui/Icon.jsx';
import SmartImage from '../components/ui/SmartImage.jsx';
import { CardGridSkeleton } from '../components/ui/Skeleton.jsx';
import { useAsync } from '../hooks/useAsync.js';
import { getHospitals, getDoctors } from '../services/api.js';
import { TREATMENT_CATEGORIES } from '../data/models.js';
import { categoryImages, heroImage } from '../data/images.js';

const STATS = [
  { value: '12,000+', label: 'Patients guided' },
  { value: '250+', label: 'Partner hospitals' },
  { value: '40+', label: 'Countries served' },
  { value: 'up to 70%', label: 'Savings vs. West' },
];

const STEPS = [
  {
    icon: 'search',
    title: 'Discover',
    text: 'Browse accredited hospitals, specialists and treatments across India.',
  },
  {
    icon: 'scale',
    title: 'Compare',
    text: 'Compare costs, ratings and facilities side by side to decide with confidence.',
  },
  {
    icon: 'stethoscope',
    title: 'Consult',
    text: 'Request a consultation and speak with your chosen doctor before you travel.',
  },
  {
    icon: 'shield',
    title: 'Get treatment',
    text: 'Arrive to world-class care with visa, travel and language support handled.',
  },
];

export default function Home() {
  const hospitals = useAsync(getHospitals, []);
  const doctors = useAsync(getDoctors, []);

  return (
    <div>
      {/* Hero — soft & light */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-brand-50/60 via-white to-white" />
        <div className="container-content relative pb-10 pt-12 sm:pt-16">
          <div className="mx-auto max-w-3xl text-center animate-fade-up">
            <span className="inline-flex items-center gap-2 rounded-full border border-ink-200 bg-white px-3 py-1 text-xs font-medium text-ink-600 shadow-soft">
              <Icon name="shield" size={14} className="text-brand-600" />
              Trusted by 12,000+ patients · JCI &amp; NABH partners
            </span>
            <h1 className="mt-6 font-display text-4xl font-extrabold leading-[1.05] tracking-tight text-ink-900 sm:text-5xl lg:text-[3.4rem]">
              World-class medical care,
              <br className="hidden sm:block" /> discovered simply in India
            </h1>
            <p className="mx-auto mt-5 max-w-xl text-lg leading-relaxed text-ink-500">
              Find top hospitals and doctors, compare transparent costs, and
              request a consultation — all in one trusted place for international
              patients.
            </p>
            <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
              <Button to="/explore" size="lg">
                Start exploring
                <Icon name="arrowRight" size={18} />
              </Button>
              <Button to="/consultation" size="lg" variant="outline">
                Request a consultation
              </Button>
            </div>
            <div className="mt-6 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm text-ink-500">
              {['Transparent pricing', 'Verified specialists', 'End-to-end support'].map(
                (item) => (
                  <span key={item} className="flex items-center gap-1.5">
                    <Icon name="checkCircle" size={16} className="text-brand-600" />
                    {item}
                  </span>
                )
              )}
            </div>
          </div>

          {/* Hero banner image */}
          <div className="relative mx-auto mt-12 max-w-5xl">
            <SmartImage
              src={heroImage}
              alt="Modern hospital in India"
              aspect="aspect-[16/7]"
              rounded="rounded-3xl"
              className="shadow-card"
            />
            {/* Floating stats card */}
            <div className="absolute -bottom-6 left-1/2 hidden w-[min(92%,760px)] -translate-x-1/2 grid-cols-4 gap-2 rounded-2xl border border-ink-100 bg-white/95 p-4 shadow-card-hover backdrop-blur sm:grid">
              {STATS.map((s) => (
                <div key={s.label} className="text-center">
                  <p className="font-display text-2xl font-extrabold text-ink-900">
                    {s.value}
                  </p>
                  <p className="mt-0.5 text-xs text-ink-500">{s.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Stats (mobile) */}
      <section className="border-b border-ink-100 sm:hidden">
        <div className="container-content grid grid-cols-2 gap-6 py-8">
          {STATS.map((s) => (
            <div key={s.label} className="text-center">
              <p className="font-display text-2xl font-extrabold text-ink-900">
                {s.value}
              </p>
              <p className="mt-1 text-sm text-ink-500">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Spacer for floating stats card on desktop */}
      <div className="hidden h-10 sm:block" />

      {/* Popular categories */}
      <section className="container-content py-16">
        <SectionHeader
          eyebrow="Treatments"
          title="Popular treatment categories"
          description="Explore the specialties international patients travel to India for most."
          action={{ to: '/treatments', label: 'All treatments' }}
        />
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {TREATMENT_CATEGORIES.map((cat) => (
            <Link
              key={cat}
              to={`/treatments?category=${encodeURIComponent(cat)}`}
              className="group relative overflow-hidden rounded-2xl border border-ink-100 shadow-card transition-all hover:-translate-y-0.5 hover:shadow-card-hover"
            >
              <img
                src={categoryImages[cat]}
                alt={cat}
                loading="lazy"
                className="aspect-[5/4] w-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-ink-950/40 via-ink-950/5 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 flex items-center justify-between p-4">
                <span className="rounded-full border border-white/50 bg-white/30 px-3 py-1 font-semibold text-ink-900 shadow-soft backdrop-blur-md">
                  {cat}
                </span>
                <span className="flex h-7 w-7 items-center justify-center rounded-full border border-white/50 bg-white/30 text-ink-900 backdrop-blur-md transition-transform group-hover:translate-x-0.5">
                  <Icon name="arrowRight" size={15} />
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured hospitals */}
      <section className="bg-ink-50/60 py-16">
        <div className="container-content">
          <SectionHeader
            eyebrow="Hospitals & clinics"
            title="Featured hospitals"
            description="Internationally accredited centres of excellence trusted by patients worldwide."
            action={{ to: '/hospitals', label: 'All hospitals' }}
          />
          {hospitals.loading ? (
            <CardGridSkeleton count={3} />
          ) : (
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {(hospitals.data || []).slice(0, 3).map((h) => (
                <HospitalCard key={h.id} hospital={h} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Featured doctors */}
      <section className="container-content py-16">
        <SectionHeader
          eyebrow="Specialists"
          title="Meet leading doctors"
          description="Experienced, board-certified specialists with thousands of successful procedures."
          action={{ to: '/doctors', label: 'All doctors' }}
        />
        {doctors.loading ? (
          <CardGridSkeleton count={4} />
        ) : (
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {(doctors.data || []).slice(0, 4).map((d) => (
              <DoctorCard key={d.id} doctor={d} />
            ))}
          </div>
        )}
      </section>

      {/* How it works */}
      <section className="bg-ink-50/60 py-16">
        <div className="container-content">
          <SectionHeader
            eyebrow="How it works"
            title="From discovery to treatment"
            description="A clear, supported journey — every step of the way."
          />
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {STEPS.map((step, i) => (
              <div
                key={step.title}
                className="relative rounded-2xl border border-ink-100 bg-white p-6 shadow-card"
              >
                <span className="absolute right-5 top-5 font-display text-3xl font-semibold text-ink-100">
                  0{i + 1}
                </span>
                <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-brand-50 text-brand-700">
                  <Icon name={step.icon} size={22} />
                </span>
                <h3 className="mt-4 font-semibold text-ink-900">{step.title}</h3>
                <p className="mt-1.5 text-sm leading-relaxed text-ink-500">
                  {step.text}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="container-content py-16">
        <div className="relative overflow-hidden rounded-3xl bg-brand-700 px-8 py-14 text-center sm:px-16">
          <div className="absolute inset-0 opacity-20 [background:radial-gradient(circle_at_top_right,white,transparent_45%)]" />
          <div className="relative mx-auto max-w-2xl">
            <h2 className="font-display text-3xl font-semibold text-white sm:text-4xl">
              Ready to plan your treatment?
            </h2>
            <p className="mt-4 text-lg text-white/80">
              Tell us what you need and our team will connect you with the right
              hospital and specialist — free, with no obligation.
            </p>
            <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
              <Button
                to="/consultation"
                size="lg"
                className="bg-white text-brand-700 hover:bg-white/90"
              >
                Request a consultation
                <Icon name="arrowRight" size={18} />
              </Button>
              <Button
                to="/explore"
                size="lg"
                variant="outline"
                className="border-white/30 bg-transparent text-white hover:bg-white/10"
              >
                Start exploring
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
