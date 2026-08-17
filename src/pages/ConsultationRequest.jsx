import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Field, Input, Select, Textarea } from '../components/ui/Field.jsx';
import Button from '../components/ui/Button.jsx';
import Icon from '../components/ui/Icon.jsx';
import { Skeleton } from '../components/ui/Skeleton.jsx';
import { useAsync } from '../hooks/useAsync.js';
import { useAuth } from '../context/AuthContext.jsx';
import { useToast } from '../context/ToastContext.jsx';
import {
  getHospitals,
  getDoctors,
  getTreatments,
  createConsultationRequest,
} from '../services/api.js';

const loadAll = () =>
  Promise.all([getHospitals(), getDoctors(), getTreatments()]).then(
    ([hospitals, doctors, treatments]) => ({ hospitals, doctors, treatments })
  );

const TIME_SLOTS = ['Morning', 'Afternoon', 'Evening'];

const COUNTRIES = [
  'United States', 'United Kingdom', 'Canada', 'Australia', 'United Arab Emirates',
  'Saudi Arabia', 'Nigeria', 'Kenya', 'Bangladesh', 'Nepal', 'Sri Lanka',
  'Oman', 'Qatar', 'Kuwait', 'Ethiopia', 'Germany', 'France', 'Other',
];

const emptyForm = {
  fullName: '',
  email: '',
  phone: '',
  country: '',
  treatmentId: '',
  hospitalId: '',
  doctorId: '',
  preferredDate: '',
  preferredTime: '',
  message: '',
};

export default function ConsultationRequest() {
  const { data, loading } = useAsync(loadAll, []);
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const [form, setForm] = useState(emptyForm);
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  // Pre-fill personal details from the signed-in user.
  useEffect(() => {
    if (user) {
      setForm((f) => ({
        ...f,
        fullName: f.fullName || user.fullName || '',
        email: f.email || user.email || '',
        phone: f.phone || user.phone || '',
        country: f.country || user.country || '',
      }));
    }
  }, [user]);

  // Pre-select treatment/hospital/doctor from the URL (from detail pages).
  useEffect(() => {
    setForm((f) => ({
      ...f,
      treatmentId: searchParams.get('treatment') || f.treatmentId,
      hospitalId: searchParams.get('hospital') || f.hospitalId,
      doctorId: searchParams.get('doctor') || f.doctorId,
    }));
  }, [searchParams]);

  const setField = (name, value) => {
    setForm((f) => ({ ...f, [name]: value }));
    if (errors[name]) setErrors((e) => ({ ...e, [name]: undefined }));
  };

  const validate = () => {
    const next = {};
    if (!form.fullName.trim()) next.fullName = 'Please enter your full name.';
    if (!form.email.trim()) next.email = 'Please enter your email.';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
      next.email = 'Enter a valid email address.';
    if (!form.phone.trim()) next.phone = 'Please enter your phone number.';
    else if (!/^[+()\d][\d\s()-]{6,}$/.test(form.phone))
      next.phone = 'Enter a valid phone number.';
    if (!form.country) next.country = 'Please select your country.';
    if (!form.treatmentId) next.treatmentId = 'Please choose a treatment.';
    if (!form.preferredDate) next.preferredDate = 'Please choose a preferred date.';
    else if (new Date(form.preferredDate) < new Date(new Date().toDateString()))
      next.preferredDate = 'Choose a date in the future.';
    if (!form.preferredTime) next.preferredTime = 'Please choose a preferred time.';
    if (form.message.trim().length < 10)
      next.message = 'Please add a few words about your requirement (min 10 characters).';
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) {
      toast('Please fix the highlighted fields', { type: 'default' });
      // Scroll to the first error.
      const firstError = document.querySelector('[data-error="true"]');
      firstError?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      return;
    }
    setSubmitting(true);
    try {
      const record = await createConsultationRequest(form);
      const treatment = data.treatments.find((t) => t.id === form.treatmentId);
      const hospital = data.hospitals.find((h) => h.id === form.hospitalId);
      const doctor = data.doctors.find((d) => d.id === form.doctorId);
      navigate('/consultation/success', {
        state: {
          request: record,
          treatmentName: treatment?.name,
          hospitalName: hospital?.name,
          doctorName: doctor?.name,
        },
      });
    } catch (err) {
      toast('Something went wrong. Please try again.', { type: 'default' });
      setSubmitting(false);
    }
  };

  // Doctors filtered to the selected hospital (if any) for a sensible pairing.
  const doctorOptions = (data?.doctors || []).filter(
    (d) => !form.hospitalId || d.hospitalId === form.hospitalId
  );

  return (
    <div className="container-content max-w-3xl py-10">
      <header className="mb-8">
        <h1 className="font-display text-3xl font-semibold text-ink-900 sm:text-4xl">
          Request a consultation
        </h1>
        <p className="mt-2 text-ink-500">
          Share a few details and our team will connect you with the right
          hospital and specialist — free, with no obligation.
        </p>
      </header>

      {loading ? (
        <Skeleton className="h-[32rem] w-full rounded-2xl" />
      ) : (
        <form
          onSubmit={handleSubmit}
          noValidate
          className="rounded-2xl border border-ink-100 bg-white p-6 shadow-card sm:p-8"
        >
          <FormSection title="Your details">
            <div className="grid gap-5 sm:grid-cols-2">
              <Field label="Full name" htmlFor="fullName" error={errors.fullName} required>
                <div data-error={!!errors.fullName}>
                  <Input
                    id="fullName"
                    value={form.fullName}
                    error={errors.fullName}
                    onChange={(e) => setField('fullName', e.target.value)}
                    placeholder="e.g. James Whitfield"
                  />
                </div>
              </Field>
              <Field label="Email" htmlFor="email" error={errors.email} required>
                <div data-error={!!errors.email}>
                  <Input
                    id="email"
                    type="email"
                    value={form.email}
                    error={errors.email}
                    onChange={(e) => setField('email', e.target.value)}
                    placeholder="you@example.com"
                  />
                </div>
              </Field>
              <Field label="Phone" htmlFor="phone" error={errors.phone} required>
                <div data-error={!!errors.phone}>
                  <Input
                    id="phone"
                    value={form.phone}
                    error={errors.phone}
                    onChange={(e) => setField('phone', e.target.value)}
                    placeholder="+1 415 555 0142"
                  />
                </div>
              </Field>
              <Field label="Country" htmlFor="country" error={errors.country} required>
                <div data-error={!!errors.country}>
                  <Select
                    id="country"
                    value={form.country}
                    error={errors.country}
                    onChange={(e) => setField('country', e.target.value)}
                  >
                    <option value="">Select your country</option>
                    {COUNTRIES.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </Select>
                </div>
              </Field>
            </div>
          </FormSection>

          <FormSection title="What are you looking for?">
            <div className="grid gap-5 sm:grid-cols-2">
              <Field
                label="Treatment"
                htmlFor="treatmentId"
                error={errors.treatmentId}
                required
                className="sm:col-span-2"
              >
                <div data-error={!!errors.treatmentId}>
                  <Select
                    id="treatmentId"
                    value={form.treatmentId}
                    error={errors.treatmentId}
                    onChange={(e) => setField('treatmentId', e.target.value)}
                  >
                    <option value="">Select a treatment</option>
                    {(data?.treatments || []).map((t) => (
                      <option key={t.id} value={t.id}>
                        {t.name} · {t.category}
                      </option>
                    ))}
                  </Select>
                </div>
              </Field>

              <Field label="Preferred hospital (optional)" htmlFor="hospitalId">
                <Select
                  id="hospitalId"
                  value={form.hospitalId}
                  onChange={(e) => {
                    setField('hospitalId', e.target.value);
                    // Reset doctor if it no longer belongs to the hospital.
                    setForm((f) => ({ ...f, doctorId: '' }));
                  }}
                >
                  <option value="">No preference</option>
                  {(data?.hospitals || []).map((h) => (
                    <option key={h.id} value={h.id}>
                      {h.name} · {h.city}
                    </option>
                  ))}
                </Select>
              </Field>

              <Field label="Preferred doctor (optional)" htmlFor="doctorId">
                <Select
                  id="doctorId"
                  value={form.doctorId}
                  onChange={(e) => setField('doctorId', e.target.value)}
                >
                  <option value="">No preference</option>
                  {doctorOptions.map((d) => (
                    <option key={d.id} value={d.id}>
                      {d.name} · {d.specialty}
                    </option>
                  ))}
                </Select>
              </Field>
            </div>
          </FormSection>

          <FormSection title="When works for you?">
            <div className="grid gap-5 sm:grid-cols-2">
              <Field
                label="Preferred date"
                htmlFor="preferredDate"
                error={errors.preferredDate}
                required
              >
                <div data-error={!!errors.preferredDate}>
                  <Input
                    id="preferredDate"
                    type="date"
                    min={new Date().toISOString().slice(0, 10)}
                    value={form.preferredDate}
                    error={errors.preferredDate}
                    onChange={(e) => setField('preferredDate', e.target.value)}
                  />
                </div>
              </Field>
              <Field
                label="Preferred time"
                htmlFor="preferredTime"
                error={errors.preferredTime}
                required
              >
                <div data-error={!!errors.preferredTime}>
                  <Select
                    id="preferredTime"
                    value={form.preferredTime}
                    error={errors.preferredTime}
                    onChange={(e) => setField('preferredTime', e.target.value)}
                  >
                    <option value="">Select a time</option>
                    {TIME_SLOTS.map((t) => (
                      <option key={t} value={t}>
                        {t}
                      </option>
                    ))}
                  </Select>
                </div>
              </Field>
            </div>
          </FormSection>

          <FormSection title="Your medical requirement">
            <Field
              label="Message"
              htmlFor="message"
              error={errors.message}
              hint="Describe your condition, symptoms or what you'd like to achieve."
              required
            >
              <div data-error={!!errors.message}>
                <Textarea
                  id="message"
                  rows={5}
                  value={form.message}
                  error={errors.message}
                  onChange={(e) => setField('message', e.target.value)}
                  placeholder="Tell us a little about your situation…"
                />
              </div>
            </Field>
          </FormSection>

          <div className="mt-6 flex items-center gap-3 rounded-xl bg-ink-50 p-3.5 text-sm text-ink-500">
            <Icon name="shield" size={18} className="shrink-0 text-brand-600" />
            Your information is kept private and used only to coordinate your care.
          </div>

          <Button type="submit" size="lg" fullWidth loading={submitting} className="mt-6">
            {submitting ? 'Submitting request…' : 'Submit consultation request'}
          </Button>
        </form>
      )}
    </div>
  );
}

function FormSection({ title, children }) {
  return (
    <fieldset className="mb-8 last:mb-0">
      <legend className="mb-4 text-sm font-semibold uppercase tracking-wide text-ink-500">
        {title}
      </legend>
      {children}
    </fieldset>
  );
}
