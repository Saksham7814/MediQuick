import { Link } from 'react-router-dom';
import Logo from '../layout/Logo.jsx';
import Icon from '../ui/Icon.jsx';
import { heroImage } from '../../data/images.js';

/**
 * Split-screen shell for the login / signup pages: form on the left, a
 * reassuring brand panel on the right (hidden on small screens).
 */
export default function AuthLayout({ children }) {
  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      {/* Form side */}
      <div className="flex flex-col px-5 py-8 sm:px-10">
        <div className="mb-auto">
          <Logo />
        </div>
        <div className="mx-auto w-full max-w-md py-10">{children}</div>
        <p className="mb-2 mt-auto text-center text-xs text-ink-400">
          © {new Date().getFullYear()} Mediquick · For demonstration purposes only.
        </p>
      </div>

      {/* Brand side */}
      <div className="relative hidden overflow-hidden bg-ink-950 lg:block">
        <img src={heroImage} alt="" className="absolute inset-0 h-full w-full object-cover opacity-40" />
        <div className="absolute inset-0 bg-gradient-to-br from-brand-900/70 to-ink-950/90" />
        <div className="relative flex h-full flex-col justify-end p-12">
          <blockquote className="max-w-md">
            <p className="font-display text-3xl font-medium leading-snug text-white">
              “Mediquick made it effortless to find the right surgeon in India and
              plan everything before we travelled.”
            </p>
            <footer className="mt-5 text-white/70">
              <p className="font-semibold text-white">Sofia M.</p>
              <p className="text-sm">Knee replacement · from Spain</p>
            </footer>
          </blockquote>
          <ul className="mt-10 flex flex-wrap gap-x-6 gap-y-2 text-sm text-white/80">
            {['Verified specialists', 'Transparent pricing', 'End-to-end support'].map(
              (item) => (
                <li key={item} className="flex items-center gap-1.5">
                  <Icon name="check" size={15} className="text-brand-300" />
                  {item}
                </li>
              )
            )}
          </ul>
        </div>
      </div>
    </div>
  );
}
