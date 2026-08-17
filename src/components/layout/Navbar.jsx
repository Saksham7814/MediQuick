import { useEffect, useRef, useState } from 'react';
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom';
import Logo from './Logo.jsx';
import Icon from '../ui/Icon.jsx';
import Button from '../ui/Button.jsx';
import SearchBar from '../search/SearchBar.jsx';
import MorphingSearch from '../search/MorphingSearch.jsx';
import { cx } from '../../utils/format.js';
import { useApp } from '../../context/AppContext.jsx';
import { useAuth } from '../../context/AuthContext.jsx';
import { useScrolled } from '../../hooks/useScrolled.js';

const NAV_LINKS = [
  { to: '/explore', label: 'Explore' },
  { to: '/hospitals', label: 'Hospitals' },
  { to: '/doctors', label: 'Doctors' },
  { to: '/treatments', label: 'Treatments' },
];

export default function Navbar() {
  const { savedCount, compareCount } = useApp();
  const { user, isAuthenticated, logout } = useAuth();
  const collapsed = useScrolled(28);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);
  const location = useLocation();
  const navigate = useNavigate();

  const isHome = location.pathname === '/';
  // On the home page the search lives in the header and morphs (shrinks + slides
  // up into the nav row) as the page scrolls. Nav links step aside for it.
  const linksHidden = isHome && collapsed;

  useEffect(() => {
    setMobileOpen(false);
    setMenuOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    const onClick = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', onClick);
    return () => document.removeEventListener('mousedown', onClick);
  }, []);

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  return (
    <header
      className={cx(
        'sticky top-0 z-50 border-b bg-white/95 backdrop-blur transition-shadow duration-300',
        collapsed || !isHome ? 'border-ink-100 shadow-soft' : 'border-ink-100/70'
      )}
    >
      <nav className="container-content relative flex h-16 items-center justify-between gap-4">
        <div className="flex items-center gap-8">
          <Logo />
          <ul
            className={cx(
              'hidden items-center gap-1 transition-all duration-300 lg:flex',
              linksHidden ? 'pointer-events-none -translate-y-1 opacity-0' : 'opacity-100'
            )}
          >
            {NAV_LINKS.map((link) => (
              <li key={link.to}>
                <NavLink
                  to={link.to}
                  className={({ isActive }) =>
                    cx(
                      'rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                      isActive
                        ? 'text-brand-700'
                        : 'text-ink-600 hover:bg-ink-50 hover:text-ink-900'
                    )
                  }
                >
                  {link.label}
                </NavLink>
              </li>
            ))}
          </ul>
        </div>

        <div className="flex items-center gap-1">
          <IconLink to="/compare" icon="scale" label="Compare" badge={compareCount} />
          <IconLink to="/saved" icon="heart" label="Saved" badge={savedCount} />
          {isAuthenticated && (
            <>
              <IconLink to="/messages" icon="message" label="Messages" />
              <IconLink to="/notifications" icon="bell" label="Notifications" badge={3} dot />
            </>
          )}

          {isAuthenticated ? (
            <div className="relative ml-1" ref={menuRef}>
              <button
                onClick={() => setMenuOpen((o) => !o)}
                className="flex items-center gap-2 rounded-full border border-ink-200 py-1 pl-1 pr-2.5 transition-shadow hover:shadow-soft"
                aria-haspopup="menu"
                aria-expanded={menuOpen}
              >
                <img
                  src={user.photoURL}
                  alt=""
                  className="h-7 w-7 rounded-full object-cover"
                />
                <Icon name="chevronDown" size={16} className="text-ink-500" />
              </button>
              {menuOpen && (
                <div
                  role="menu"
                  className="absolute right-0 mt-2 w-56 origin-top-right animate-scale-in overflow-hidden rounded-2xl border border-ink-100 bg-white py-1.5 shadow-card-hover"
                >
                  <div className="border-b border-ink-100 px-4 py-3">
                    <p className="truncate text-sm font-semibold text-ink-900">
                      {user.fullName}
                    </p>
                    <p className="truncate text-xs text-ink-500">{user.email}</p>
                  </div>
                  <MenuItem to="/profile" icon="user">Profile</MenuItem>
                  <MenuItem to="/appointments" icon="calendar">Appointments</MenuItem>
                  <MenuItem to="/consultations" icon="stethoscope">
                    Consultation requests
                  </MenuItem>
                  <MenuItem to="/saved" icon="heart">Saved</MenuItem>
                  <div className="my-1 border-t border-ink-100" />
                  <button
                    role="menuitem"
                    onClick={handleLogout}
                    className="flex w-full items-center gap-2.5 px-4 py-2 text-sm text-ink-700 hover:bg-ink-50"
                  >
                    <Icon name="logout" size={17} className="text-ink-400" />
                    Log out
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="ml-2 hidden items-center gap-2 sm:flex">
              <Button variant="ghost" size="sm" to="/login">
                Log in
              </Button>
              <Button size="sm" to="/signup">
                Sign up
              </Button>
            </div>
          )}

          <button
            className="ml-1 flex h-10 w-10 items-center justify-center rounded-lg text-ink-700 hover:bg-ink-50 lg:hidden"
            onClick={() => setMobileOpen((o) => !o)}
            aria-label="Menu"
          >
            <Icon name={mobileOpen ? 'x' : 'menu'} />
          </button>
        </div>
      </nav>

      {/* Home search. Desktop/tablet: morphs (shrinks + slides into the nav row)
          as you scroll. Mobile: a simple persistent search row. */}
      {isHome && (
        <>
          <div className="hidden md:block">
            <MorphingSearch />
          </div>
          <div className="container-content px-5 pb-3 pt-1 md:hidden">
            <SearchBar />
          </div>
        </>
      )}

      {/* Mobile drawer */}
      {mobileOpen && (
        <div className="border-t border-ink-100 bg-white lg:hidden">
          <div className="container-content flex flex-col py-3">
            {NAV_LINKS.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                className={({ isActive }) =>
                  cx(
                    'rounded-lg px-3 py-2.5 text-sm font-medium',
                    isActive ? 'bg-brand-50 text-brand-700' : 'text-ink-700 hover:bg-ink-50'
                  )
                }
              >
                {link.label}
              </NavLink>
            ))}
            {!isAuthenticated && (
              <div className="mt-3 flex gap-2 border-t border-ink-100 pt-3">
                <Button variant="outline" fullWidth to="/login">
                  Log in
                </Button>
                <Button fullWidth to="/signup">
                  Sign up
                </Button>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
}

function IconLink({ to, icon, label, badge, dot }) {
  return (
    <Link
      to={to}
      aria-label={label}
      title={label}
      className="relative hidden h-10 w-10 items-center justify-center rounded-full text-ink-600 transition-colors hover:bg-ink-50 hover:text-ink-900 sm:flex"
    >
      <Icon name={icon} size={20} />
      {badge > 0 && (
        <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-brand-600 px-1 text-[10px] font-semibold text-white">
          {badge}
        </span>
      )}
      {dot && !badge && (
        <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-brand-500" />
      )}
    </Link>
  );
}

function MenuItem({ to, icon, children }) {
  return (
    <Link
      role="menuitem"
      to={to}
      className="flex items-center gap-2.5 px-4 py-2 text-sm text-ink-700 hover:bg-ink-50"
    >
      <Icon name={icon} size={17} className="text-ink-400" />
      {children}
    </Link>
  );
}
