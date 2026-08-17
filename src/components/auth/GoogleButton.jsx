import Spinner from '../ui/Spinner.jsx';

/** "Continue with Google" button with the official multi-colour mark. */
export default function GoogleButton({ onClick, loading, label = 'Continue with Google' }) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={loading}
      className="inline-flex h-11 w-full items-center justify-center gap-3 rounded-xl border border-ink-200 bg-white text-sm font-semibold text-ink-800 transition-colors hover:bg-ink-50 disabled:opacity-60"
    >
      {loading ? (
        <Spinner size={18} className="text-ink-500" />
      ) : (
        <svg width="18" height="18" viewBox="0 0 48 48" aria-hidden>
          <path
            fill="#FFC107"
            d="M43.6 20.5H42V20H24v8h11.3c-1.6 4.7-6.1 8-11.3 8-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.9 1.2 8 3.1l5.7-5.7C34.6 4.1 29.6 2 24 2 11.8 2 2 11.8 2 24s9.8 22 22 22 22-9.8 22-22c0-1.2-.1-2.3-.4-3.5z"
          />
          <path
            fill="#FF3D00"
            d="M6.3 14.7l6.6 4.8C14.7 16 19 13 24 13c3.1 0 5.9 1.2 8 3.1l5.7-5.7C34.6 6.1 29.6 4 24 4 16 4 9.1 8.6 6.3 14.7z"
          />
          <path
            fill="#4CAF50"
            d="M24 46c5.5 0 10.4-2.1 14.1-5.5l-6.5-5.5C29.6 36.7 26.9 38 24 38c-5.2 0-9.6-3.3-11.3-7.9l-6.6 5.1C9 41.4 15.9 46 24 46z"
          />
          <path
            fill="#1976D2"
            d="M43.6 20.5H42V20H24v8h11.3c-.8 2.2-2.2 4.1-4.1 5.5l6.5 5.5c-.5.4 7.3-5.3 7.3-15 0-1.2-.1-2.3-.4-3.5z"
          />
        </svg>
      )}
      {label}
    </button>
  );
}
