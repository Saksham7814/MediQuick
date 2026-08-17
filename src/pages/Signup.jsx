import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AuthLayout from '../components/auth/AuthLayout.jsx';
import GoogleButton from '../components/auth/GoogleButton.jsx';
import { Field, Input } from '../components/ui/Field.jsx';
import Button from '../components/ui/Button.jsx';
import Icon from '../components/ui/Icon.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import { useToast } from '../context/ToastContext.jsx';
import { cx } from '../utils/format.js';

export default function Signup() {
  const { signup, loginWithGoogle } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    fullName: '',
    email: '',
    password: '',
    country: '',
    agree: false,
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  const setField = (name, value) => {
    setForm((f) => ({ ...f, [name]: value }));
    if (errors[name]) setErrors((e) => ({ ...e, [name]: undefined }));
  };

  const passwordStrength = getStrength(form.password);

  const validate = () => {
    const next = {};
    if (!form.fullName.trim()) next.fullName = 'Please enter your full name.';
    if (!form.email.trim()) next.email = 'Please enter your email.';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
      next.email = 'Enter a valid email address.';
    if (!form.password) next.password = 'Please create a password.';
    else if (form.password.length < 6)
      next.password = 'Password must be at least 6 characters.';
    if (!form.country.trim()) next.country = 'Please enter your country.';
    if (!form.agree) next.agree = 'Please accept the terms to continue.';
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    try {
      await signup(form);
      toast('Account created', { type: 'success' });
      navigate('/', { replace: true });
    } catch (err) {
      setErrors((prev) => ({ ...prev, password: err.message }));
    } finally {
      setLoading(false);
    }
  };

  const handleGoogle = async () => {
    setGoogleLoading(true);
    try {
      await loginWithGoogle();
      navigate('/', { replace: true });
    } catch {
      toast('Google sign-up failed. Please try again.');
    } finally {
      setGoogleLoading(false);
    }
  };

  return (
    <AuthLayout>
      <div>
        <h1 className="font-display text-3xl font-semibold text-ink-900">
          Create your account
        </h1>
        <p className="mt-2 text-ink-500">
          Save hospitals, compare options and request consultations.
        </p>

        <div className="mt-8">
          <GoogleButton onClick={handleGoogle} loading={googleLoading} label="Sign up with Google" />
        </div>

        <div className="my-6 flex items-center gap-3 text-sm text-ink-400">
          <span className="h-px flex-1 bg-ink-200" />
          or sign up with email
          <span className="h-px flex-1 bg-ink-200" />
        </div>

        <form onSubmit={handleSubmit} noValidate className="space-y-4">
          <Field label="Full name" htmlFor="fullName" error={errors.fullName}>
            <Input
              id="fullName"
              icon="user"
              value={form.fullName}
              error={errors.fullName}
              onChange={(e) => setField('fullName', e.target.value)}
              placeholder="Your name"
              autoComplete="name"
            />
          </Field>
          <Field label="Email" htmlFor="email" error={errors.email}>
            <Input
              id="email"
              type="email"
              icon="mail"
              value={form.email}
              error={errors.email}
              onChange={(e) => setField('email', e.target.value)}
              placeholder="you@example.com"
              autoComplete="email"
            />
          </Field>
          <Field
            label="Password"
            htmlFor="password"
            error={errors.password}
            hint={!errors.password ? 'At least 6 characters.' : undefined}
          >
            <Input
              id="password"
              type="password"
              value={form.password}
              error={errors.password}
              onChange={(e) => setField('password', e.target.value)}
              placeholder="Create a password"
              autoComplete="new-password"
            />
            {form.password && (
              <div className="mt-2 flex gap-1.5">
                {[0, 1, 2].map((i) => (
                  <span
                    key={i}
                    className={cx(
                      'h-1 flex-1 rounded-full transition-colors',
                      i < passwordStrength.score
                        ? passwordStrength.color
                        : 'bg-ink-200'
                    )}
                  />
                ))}
              </div>
            )}
          </Field>
          <Field label="Country" htmlFor="country" error={errors.country}>
            <Input
              id="country"
              icon="globe"
              value={form.country}
              error={errors.country}
              onChange={(e) => setField('country', e.target.value)}
              placeholder="Where are you based?"
              autoComplete="country-name"
            />
          </Field>

          <div>
            <label className="flex cursor-pointer items-start gap-2.5">
              <button
                type="button"
                role="checkbox"
                aria-checked={form.agree}
                onClick={() => setField('agree', !form.agree)}
                className={cx(
                  'mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-md border transition-colors',
                  form.agree
                    ? 'border-brand-600 bg-brand-600 text-white'
                    : 'border-ink-300 bg-white'
                )}
              >
                {form.agree && <Icon name="check" size={14} />}
              </button>
              <span className="text-sm text-ink-600">
                I agree to Mediquick’s{' '}
                <Link to="/" className="font-medium text-brand-700 hover:underline">
                  Terms
                </Link>{' '}
                and{' '}
                <Link to="/" className="font-medium text-brand-700 hover:underline">
                  Privacy Policy
                </Link>
                .
              </span>
            </label>
            {errors.agree && (
              <p className="mt-1.5 text-xs font-medium text-red-600">{errors.agree}</p>
            )}
          </div>

          <Button type="submit" size="lg" fullWidth loading={loading}>
            Create account
          </Button>
        </form>

        <p className="mt-6 text-center text-sm text-ink-500">
          Already have an account?{' '}
          <Link to="/login" className="font-semibold text-brand-700 hover:underline">
            Log in
          </Link>
        </p>
      </div>
    </AuthLayout>
  );
}

function getStrength(password) {
  let score = 0;
  if (password.length >= 6) score++;
  if (password.length >= 10 || /[0-9]/.test(password)) score++;
  if (/[^A-Za-z0-9]/.test(password)) score++;
  const colors = ['bg-red-400', 'bg-amber-400', 'bg-emerald-500'];
  return { score, color: colors[Math.min(score, 3) - 1] || 'bg-ink-200' };
}
