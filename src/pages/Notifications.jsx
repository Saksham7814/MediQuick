import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Icon from '../components/ui/Icon.jsx';
import { EmptyState, ErrorState } from '../components/ui/States.jsx';
import { Skeleton } from '../components/ui/Skeleton.jsx';
import { useAsync } from '../hooks/useAsync.js';
import { getNotifications } from '../services/api.js';
import { timeAgo, cx } from '../utils/format.js';

const ICONS = {
  appointment: { name: 'calendar', tone: 'bg-brand-50 text-brand-700' },
  message: { name: 'message', tone: 'bg-accent-50 text-accent-700' },
  consultation: { name: 'stethoscope', tone: 'bg-emerald-50 text-emerald-700' },
  update: { name: 'sparkles', tone: 'bg-ink-100 text-ink-700' },
};

export default function Notifications() {
  const { data, loading, error, retry } = useAsync(getNotifications, []);
  const [items, setItems] = useState([]);

  useEffect(() => {
    if (data) setItems(data);
  }, [data]);

  const unreadCount = items.filter((n) => !n.read).length;
  const markAllRead = () => setItems((prev) => prev.map((n) => ({ ...n, read: true })));
  const markRead = (id) =>
    setItems((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)));

  return (
    <div className="container-content max-w-2xl py-10">
      <header className="mb-6 flex items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl font-semibold text-ink-900 sm:text-4xl">
            Notifications
          </h1>
          <p className="mt-2 text-ink-500">
            {unreadCount > 0
              ? `You have ${unreadCount} unread notification${unreadCount > 1 ? 's' : ''}.`
              : 'You’re all caught up.'}
          </p>
        </div>
        {unreadCount > 0 && (
          <button
            onClick={markAllRead}
            className="whitespace-nowrap text-sm font-medium text-brand-700 hover:text-brand-800"
          >
            Mark all read
          </button>
        )}
      </header>

      {loading ? (
        <div className="space-y-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-20 w-full rounded-2xl" />
          ))}
        </div>
      ) : error ? (
        <ErrorState description="We couldn't load your notifications." onRetry={retry} />
      ) : items.length === 0 ? (
        <EmptyState icon="bell" title="No notifications" description="Updates about your care will appear here." />
      ) : (
        <div className="overflow-hidden rounded-2xl border border-ink-100 bg-white shadow-card">
          {items.map((n) => {
            const icon = ICONS[n.type] || ICONS.update;
            const body = (
              <div
                className={cx(
                  'flex gap-4 p-4 transition-colors',
                  !n.read && 'bg-brand-50/40'
                )}
              >
                <span
                  className={cx(
                    'flex h-10 w-10 shrink-0 items-center justify-center rounded-full',
                    icon.tone
                  )}
                >
                  <Icon name={icon.name} size={19} />
                </span>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-2">
                    <p className="font-semibold text-ink-900">{n.title}</p>
                    <span className="shrink-0 text-xs text-ink-400">{timeAgo(n.at)}</span>
                  </div>
                  <p className="mt-0.5 text-sm text-ink-500">{n.body}</p>
                </div>
                {!n.read && (
                  <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-brand-600" />
                )}
              </div>
            );

            return n.link ? (
              <Link
                key={n.id}
                to={n.link}
                onClick={() => markRead(n.id)}
                className="block border-b border-ink-50 last:border-0 hover:bg-ink-50/60"
              >
                {body}
              </Link>
            ) : (
              <div key={n.id} className="border-b border-ink-50 last:border-0">
                {body}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
