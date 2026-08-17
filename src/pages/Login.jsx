import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import AuthLayout from '../components/auth/AuthLayout.jsx';
import GoogleButton from '../components/auth/GoogleButton.jsx';
import { Field, Input } from '../components/ui/Field.jsx';
import Button from '../components/ui/Button.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import { useToast } from '../context/ToastContext.jsx';

export default function Login() {
  const { login, loginWithGoogle } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || '/';

  const [form, setForm] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  const setField = (name, value) => {
    setForm((f) => ({ ...f, [name]: value }));
    if (errors[name]) setErrors((e) => ({ ...e, [name]: undefined }));
  };

  const validate = () => {
    const next = {};
    if (!form.email.trim()) next.email = 'Please enter your email.';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
      next.email = 'Enter a valid email address.';
    if (!form.password) next.password = 'Please enter your password.';
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    try {
      await login(form.email, form.password);
      toast('Welcome back', { type: 'success' });
      navigate(from, { replace: true });
    } catch (err) {
      setErrors({ password: err.message || 'Unable to log in.' });
    } finally {
      setLoading(false);
    }
  };

  const handleGoogle = async () => {
    setGoogleLoading(true);
    try {
      await loginWithGoogle();
      navigate(from, { replace: true });
    } catch {
      toast('Google sign-in failed. Please try again.');
    } finally {
      setGoogleLoading(false);
    }
  };

  return (
    <AuthLayout>
      <div>
        <h1 className="font-display text-3xl font-semibold text-ink-900">
          Welcome back
        </h1>
        <p className="mt-2 text-ink-500">
          Log in to manage your consultations and appointments.
        </p>

        <div className="mt-8">
          <GoogleButton onClick={handleGoogle} loading={googleLoading} label="Log in with Google" />
        </div>

        <div className="my-6 flex items-center gap-3 text-sm text-ink-400">
          <span className="h-px flex-1 bg-ink-200" />
          or continue with email
          <span className="h-px flex-1 bg-ink-200" />
        </div>

        <form onSubmit={handleSubmit} noValidate className="space-y-4">
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
          <Field label="Password" htmlFor="password" error={errors.password}>
            <Input
              id="password"
              type="password"
              value={form.password}
              error={errors.password}
              onChange={(e) => setField('password', e.target.value)}
              placeholder="••••••••"
              autoComplete="current-password"
            />
          </Field>

          <div className="flex justify-end">
            <button
              type="button"
              onClick={() => toast('Password reset coming soon')}
              className="text-sm font-medium text-brand-700 hover:text-brand-800"
            >
              Forgot password?
            </button>
          </div>

          <Button type="submit" size="lg" fullWidth loading={loading}>
            Log in
          </Button>
        </form>

        <p className="mt-6 text-center text-sm text-ink-500">
          Don’t have an account?{' '}
          <Link to="/signup" className="font-semibold text-brand-700 hover:underline">
            Sign up
          </Link>
        </p>
      </div>
    </AuthLayout>
  );
}
