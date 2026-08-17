import { useEffect, useMemo, useRef, useState } from 'react';
import Icon from '../components/ui/Icon.jsx';
import { Skeleton } from '../components/ui/Skeleton.jsx';
import { EmptyState, ErrorState } from '../components/ui/States.jsx';
import { useAsync } from '../hooks/useAsync.js';
import {
  getConversations,
  getDoctors,
  getHospitals,
  sendMessage,
} from '../services/api.js';
import { formatTime, timeAgo, cx } from '../utils/format.js';

const load = () =>
  Promise.all([getConversations(), getDoctors(), getHospitals()]).then(
    ([conversations, doctors, hospitals]) => ({ conversations, doctors, hospitals })
  );

export default function Messages() {
  const { data, loading, error, retry } = useAsync(load, []);
  const [activeId, setActiveId] = useState(null);
  const [threads, setThreads] = useState(null);
  const [draft, setDraft] = useState('');
  const [sending, setSending] = useState(false);
  const [showChatMobile, setShowChatMobile] = useState(false);
  const scrollRef = useRef(null);

  // Local copy so sent messages appear instantly.
  useEffect(() => {
    if (data?.conversations) {
      setThreads(data.conversations);
      setActiveId((prev) => prev || data.conversations[0]?.id || null);
    }
  }, [data]);

  const resolveProvider = (conv) => {
    if (!data) return { name: 'Provider', image: null };
    if (conv.providerType === 'doctor') {
      const d = data.doctors.find((x) => x.id === conv.providerId);
      return { name: d?.name || 'Doctor', image: d?.image, subtitle: conv.subtitle };
    }
    const h = data.hospitals.find((x) => x.id === conv.providerId);
    return { name: h?.name || 'Hospital', image: h?.thumbnail, subtitle: conv.subtitle };
  };

  const active = useMemo(
    () => (threads || []).find((c) => c.id === activeId) || null,
    [threads, activeId]
  );

  // Auto-scroll to the latest message.
  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight });
  }, [active?.messages?.length, activeId]);

  const handleSend = async (e) => {
    e.preventDefault();
    const text = draft.trim();
    if (!text || !active) return;
    setSending(true);
    // Optimistic update.
    const optimistic = {
      id: `local-${Date.now()}`,
      from: 'patient',
      text,
      at: new Date().toISOString(),
    };
    setThreads((prev) =>
      prev.map((c) =>
        c.id === active.id ? { ...c, messages: [...c.messages, optimistic] } : c
      )
    );
    setDraft('');
    try {
      await sendMessage(active.id, text);
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="container-content py-10">
      <header className="mb-6">
        <h1 className="font-display text-3xl font-semibold text-ink-900 sm:text-4xl">
          Messages
        </h1>
        <p className="mt-2 text-ink-500">
          Chat directly with your hospitals and care coordinators.
        </p>
      </header>

      {loading ? (
        <Skeleton className="h-[32rem] w-full rounded-2xl" />
      ) : error ? (
        <ErrorState description="We couldn't load your messages." onRetry={retry} />
      ) : (threads || []).length === 0 ? (
        <EmptyState icon="message" title="No conversations yet" />
      ) : (
        <div className="grid h-[34rem] overflow-hidden rounded-2xl border border-ink-100 bg-white shadow-card md:grid-cols-[20rem_1fr]">
          {/* Conversation list */}
          <div
            className={cx(
              'flex-col border-r border-ink-100',
              showChatMobile ? 'hidden md:flex' : 'flex'
            )}
          >
            <div className="border-b border-ink-100 px-4 py-3">
              <p className="text-sm font-semibold text-ink-900">Conversations</p>
            </div>
            <div className="flex-1 overflow-y-auto">
              {(threads || []).map((conv) => {
                const p = resolveProvider(conv);
                const last = conv.messages[conv.messages.length - 1];
                return (
                  <button
                    key={conv.id}
                    onClick={() => {
                      setActiveId(conv.id);
                      setShowChatMobile(true);
                    }}
                    className={cx(
                      'flex w-full items-center gap-3 border-b border-ink-50 px-4 py-3 text-left transition-colors hover:bg-ink-50',
                      conv.id === activeId && 'bg-brand-50/60'
                    )}
                  >
                    <Avatar src={p.image} name={p.name} />
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between gap-2">
                        <p className="truncate text-sm font-semibold text-ink-900">
                          {p.name}
                        </p>
                        <span className="shrink-0 text-xs text-ink-400">
                          {last ? timeAgo(last.at) : ''}
                        </span>
                      </div>
                      <p className="truncate text-sm text-ink-500">
                        {last?.from === 'patient' ? 'You: ' : ''}
                        {last?.text}
                      </p>
                    </div>
                    {conv.unread > 0 && (
                      <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-brand-600 px-1 text-xs font-semibold text-white">
                        {conv.unread}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Chat window */}
          <div className={cx('flex-col', showChatMobile ? 'flex' : 'hidden md:flex')}>
            {active ? (
              <>
                <div className="flex items-center gap-3 border-b border-ink-100 px-4 py-3">
                  <button
                    className="md:hidden"
                    onClick={() => setShowChatMobile(false)}
                    aria-label="Back"
                  >
                    <Icon name="chevronLeft" />
                  </button>
                  {(() => {
                    const p = resolveProvider(active);
                    return (
                      <>
                        <Avatar src={p.image} name={p.name} />
                        <div>
                          <p className="text-sm font-semibold text-ink-900">{p.name}</p>
                          <p className="text-xs text-ink-500">{p.subtitle}</p>
                        </div>
                      </>
                    );
                  })()}
                </div>

                <div ref={scrollRef} className="flex-1 space-y-3 overflow-y-auto bg-ink-50/40 p-4">
                  {active.messages.map((m) => (
                    <Bubble key={m.id} message={m} />
                  ))}
                </div>

                <form onSubmit={handleSend} className="flex items-center gap-2 border-t border-ink-100 p-3">
                  <input
                    value={draft}
                    onChange={(e) => setDraft(e.target.value)}
                    placeholder="Type a message…"
                    className="h-11 flex-1 rounded-xl border border-ink-200 bg-white px-3.5 text-[15px] focus:border-brand-500"
                  />
                  <button
                    type="submit"
                    disabled={!draft.trim() || sending}
                    className="flex h-11 w-11 items-center justify-center rounded-xl bg-brand-600 text-white transition-colors hover:bg-brand-700 disabled:opacity-50"
                    aria-label="Send"
                  >
                    <Icon name="send" size={18} />
                  </button>
                </form>
              </>
            ) : (
              <div className="flex flex-1 items-center justify-center text-ink-400">
                Select a conversation
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

function Bubble({ message }) {
  const mine = message.from === 'patient';
  return (
    <div className={cx('flex', mine ? 'justify-end' : 'justify-start')}>
      <div
        className={cx(
          'max-w-[80%] rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed',
          mine
            ? 'rounded-br-md bg-brand-600 text-white'
            : 'rounded-bl-md border border-ink-100 bg-white text-ink-800'
        )}
      >
        <p>{message.text}</p>
        <p className={cx('mt-1 text-[11px]', mine ? 'text-white/70' : 'text-ink-400')}>
          {formatTime(message.at)}
        </p>
      </div>
    </div>
  );
}

function Avatar({ src, name }) {
  if (src) {
    return (
      <img src={src} alt={name} className="h-10 w-10 shrink-0 rounded-full object-cover" />
    );
  }
  return (
    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-brand-100 text-sm font-semibold text-brand-700">
      {name?.[0] || '?'}
    </span>
  );
}
