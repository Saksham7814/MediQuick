import { Link } from 'react-router-dom';
import Logo from './Logo.jsx';
import Icon from '../ui/Icon.jsx';

const columns = [
  {
    title: 'Discover',
    links: [
      { to: '/explore', label: 'Explore' },
      { to: '/hospitals', label: 'Hospitals & Clinics' },
      { to: '/doctors', label: 'Doctors' },
      { to: '/treatments', label: 'Treatments' },
    ],
  },
  {
    title: 'Your care',
    links: [
      { to: '/saved', label: 'Saved' },
      { to: '/compare', label: 'Compare' },
      { to: '/appointments', label: 'Appointments' },
      { to: '/consultations', label: 'Consultation requests' },
    ],
  },
  {
    title: 'Company',
    links: [
      { to: '/', label: 'About Mediquick' },
      { to: '/', label: 'How it works' },
      { to: '/', label: 'Patient stories' },
      { to: '/', label: 'Contact' },
    ],
  },
];

export default function Footer() {
  return (
    <footer className="mt-20 border-t border-ink-100 bg-ink-50/60">
      <div className="container-content py-14">
        <div className="grid gap-10 md:grid-cols-[1.4fr_repeat(3,1fr)]">
          <div>
            <Logo />
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-ink-500">
              Helping international patients discover, compare and consult with
              world-class hospitals and doctors across India.
            </p>
            <div className="mt-5 flex items-center gap-2 text-sm text-ink-500">
              <Icon name="shield" size={16} className="text-brand-600" />
              JCI & NABH accredited partners
            </div>
          </div>

          {columns.map((col) => (
            <div key={col.title}>
              <h4 className="text-sm font-semibold text-ink-900">{col.title}</h4>
              <ul className="mt-4 space-y-2.5">
                {col.links.map((link, i) => (
                  <li key={`${col.title}-${i}`}>
                    <Link
                      to={link.to}
                      className="text-sm text-ink-500 transition-colors hover:text-ink-900"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-ink-200 pt-6 sm:flex-row">
          <p className="text-xs text-ink-500">
            © {new Date().getFullYear()} Mediquick. For demonstration purposes only —
            not medical advice.
          </p>
          <div className="flex items-center gap-5 text-xs text-ink-500">
            <Link to="/" className="hover:text-ink-900">Privacy</Link>
            <Link to="/" className="hover:text-ink-900">Terms</Link>
            <Link to="/" className="hover:text-ink-900">Cookies</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
