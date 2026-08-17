import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Field, Input, Select } from '../components/ui/Field.jsx';
import Button from '../components/ui/Button.jsx';
import Icon from '../components/ui/Icon.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import { useApp } from '../context/AppContext.jsx';
import { useToast } from '../context/ToastContext.jsx';
import { formatDate, cx } from '../utils/format.js';

export default function Profile() {
  const { user, logout, updateProfile } = useAuth();
  const { savedCount } = useApp();
  const { toast } = useToast();
  const navigate = useNavigate();

  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    fullName: user.fullName,
    phone: user.phone,
    country: user.country,
    city: user.city || '',
    dateOfBirth: user.dateOfBirth || '',
    gender: user.gender || '',
    bloodGroup: user.bloodGroup || '',
  });
  const [settings, setSettings] = useState(user.settings || {});

  const setField = (name, value) => setForm((f) => ({ ...f, [name]: value }));

  const handleSave = async () => {
    setSaving(true);
    try {
      await updateProfile(form);
      toast('Profile updated', { type: 'success' });
      setEditing(false);
    } finally {
      setSaving(false);
    }
  };

  const toggleSetting = async (key) => {
    const next = { ...settings, [key]: !settings[key] };
    setSettings(next);
    await updateProfile({ settings: next });
  };

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  return (
    <div className="container-content max-w-4xl py-10">
      <header className="mb-8">
        <h1 className="font-display text-3xl font-semibold text-ink-900 sm:text-4xl">
          Profile
        </h1>
        <p className="mt-2 text-ink-500">Manage your details and preferences.</p>
      </header>

      {/* Identity card */}
      <div className="flex flex-col items-center gap-5 rounded-2xl border border-ink-100 bg-white p-6 shadow-card sm:flex-row sm:items-center">
        <div className="relative">
          <img
            src={user.photoURL}
            alt={user.fullName}
            className="h-20 w-20 rounded-full object-cover"
          />
          <button
            className="absolute -bottom-1 -right-1 flex h-8 w-8 items-center justify-center rounded-full border-2 border-white bg-brand-600 text-white"
            aria-label="Change photo"
            onClick={() => toast('Photo upload coming soon')}
          >
            <Icon name="camera" size={15} />
          </button>
        </div>
        <div className="flex-1 text-center sm:text-left">
          <h2 className="text-xl font-semibold text-ink-900">{user.fullName}</h2>
          <p className="text-ink-500">{user.email}</p>
          <p className="mt-1 text-sm text-ink-400">
            Member since {formatDate(user.memberSince)}
          </p>
        </div>
        <Button variant="outline" onClick={handleLogout}>
          <Icon name="logout" size={17} />
          Log out
        </Button>
      </div>

      {/* Quick links */}
      <div className="mt-5 grid grid-cols-2 gap-4 sm:grid-cols-4">
        <StatLink to="/saved" icon="heart" label="Saved items" value={savedCount} />
        <StatLink to="/appointments" icon="calendar" label="Appointments" value="2" />
        <StatLink to="/consultations" icon="stethoscope" label="Requests" value="3" />
        <StatLink to="/messages" icon="message" label="Messages" value="3" />
      </div>

      {/* Personal information */}
      <section className="mt-8 rounded-2xl border border-ink-100 bg-white p-6 shadow-card">
        <div className="mb-5 flex items-center justify-between">
          <h3 className="text-lg font-semibold text-ink-900">Personal information</h3>
          {editing ? (
            <div className="flex gap-2">
              <Button variant="ghost" size="sm" onClick={() => setEditing(false)}>
                Cancel
              </Button>
              <Button size="sm" loading={saving} onClick={handleSave}>
                Save changes
              </Button>
            </div>
          ) : (
            <Button variant="outline" size="sm" onClick={() => setEditing(true)}>
              Edit
            </Button>
          )}
        </div>

        {editing ? (
          <div className="grid gap-5 sm:grid-cols-2">
            <Field label="Full name" htmlFor="fullName">
              <Input id="fullName" value={form.fullName} onChange={(e) => setField('fullName', e.target.value)} />
            </Field>
            <Field label="Phone" htmlFor="phone">
              <Input id="phone" value={form.phone} onChange={(e) => setField('phone', e.target.value)} />
            </Field>
            <Field label="Country" htmlFor="country">
              <Input id="country" value={form.country} onChange={(e) => setField('country', e.target.value)} />
            </Field>
            <Field label="City" htmlFor="city">
              <Input id="city" value={form.city} onChange={(e) => setField('city', e.target.value)} />
            </Field>
            <Field label="Date of birth" htmlFor="dob">
              <Input id="dob" type="date" value={form.dateOfBirth} onChange={(e) => setField('dateOfBirth', e.target.value)} />
            </Field>
            <Field label="Gender" htmlFor="gender">
              <Select id="gender" value={form.gender} onChange={(e) => setField('gender', e.target.value)}>
                <option value="">Prefer not to say</option>
                <option>Male</option>
                <option>Female</option>
                <option>Other</option>
              </Select>
            </Field>
            <Field label="Blood group" htmlFor="blood">
              <Select id="blood" value={form.bloodGroup} onChange={(e) => setField('bloodGroup', e.target.value)}>
                <option value="">Unknown</option>
                {['O+', 'O-', 'A+', 'A-', 'B+', 'B-', 'AB+', 'AB-'].map((b) => (
                  <option key={b}>{b}</option>
                ))}
              </Select>
            </Field>
          </div>
        ) : (
          <dl className="grid gap-x-8 gap-y-4 sm:grid-cols-2">
            <InfoRow label="Full name" value={user.fullName} />
            <InfoRow label="Email" value={user.email} />
            <InfoRow label="Phone" value={form.phone} />
            <InfoRow label="Country" value={form.country} />
            <InfoRow label="City" value={form.city} />
            <InfoRow label="Date of birth" value={form.dateOfBirth ? formatDate(form.dateOfBirth) : '—'} />
            <InfoRow label="Gender" value={form.gender || '—'} />
            <InfoRow label="Blood group" value={form.bloodGroup || '—'} />
          </dl>
        )}
      </section>

      {/* Settings */}
      <section className="mt-8 rounded-2xl border border-ink-100 bg-white p-6 shadow-card">
        <h3 className="mb-5 text-lg font-semibold text-ink-900">Settings</h3>
        <div className="divide-y divide-ink-100">
          <Toggle
            label="Email notifications"
            description="Appointment and consultation updates by email."
            checked={!!settings.emailNotifications}
            onChange={() => toggleSetting('emailNotifications')}
          />
          <Toggle
            label="SMS notifications"
            description="Text alerts for time-sensitive updates."
            checked={!!settings.smsNotifications}
            onChange={() => toggleSetting('smsNotifications')}
          />
          <Toggle
            label="Marketing emails"
            description="Occasional treatment offers and health tips."
            checked={!!settings.marketingEmails}
            onChange={() => toggleSetting('marketingEmails')}
          />
        </div>
      </section>
    </div>
  );
}

function StatLink({ to, icon, label, value }) {
  return (
    <Link
      to={to}
      className="rounded-2xl border border-ink-100 bg-white p-4 shadow-card transition-all hover:-translate-y-0.5 hover:shadow-card-hover"
    >
      <Icon name={icon} size={19} className="text-brand-600" />
      <p className="mt-2 text-xl font-semibold text-ink-900">{value}</p>
      <p className="text-xs text-ink-500">{label}</p>
    </Link>
  );
}

function InfoRow({ label, value }) {
  return (
    <div>
      <dt className="text-sm text-ink-500">{label}</dt>
      <dd className="mt-0.5 font-medium text-ink-900">{value}</dd>
    </div>
  );
}

function Toggle({ label, description, checked, onChange }) {
  return (
    <div className="flex items-center justify-between gap-4 py-4 first:pt-0 last:pb-0">
      <div>
        <p className="font-medium text-ink-900">{label}</p>
        <p className="text-sm text-ink-500">{description}</p>
      </div>
      <button
        role="switch"
        aria-checked={checked}
        onClick={onChange}
        className={cx(
          'relative h-6 w-11 shrink-0 rounded-full transition-colors',
          checked ? 'bg-brand-600' : 'bg-ink-200'
        )}
      >
        <span
          className={cx(
            'absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform',
            checked ? 'translate-x-[22px]' : 'translate-x-0.5'
          )}
        />
      </button>
    </div>
  );
}
