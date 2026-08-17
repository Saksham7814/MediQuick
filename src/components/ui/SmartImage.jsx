import { useState } from 'react';
import { cx } from '../../utils/format.js';

/**
 * Image with a graceful loading shimmer and a tasteful fallback if the remote
 * source fails (remote demo imagery can occasionally 404). Keeps layout stable
 * via an aspect-ratio wrapper.
 */
export default function SmartImage({
  src,
  alt = '',
  className = '',
  imgClassName = '',
  aspect = 'aspect-[4/3]',
  rounded = '',
}) {
  const [status, setStatus] = useState('loading'); // loading | loaded | error

  return (
    <div className={cx('relative overflow-hidden bg-ink-100', aspect, rounded, className)}>
      {status === 'loading' && <div className="skeleton absolute inset-0" />}
      {status === 'error' ? (
        <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-brand-50 to-ink-100">
          <span className="font-display text-2xl font-bold text-brand-300">Mediquick</span>
        </div>
      ) : (
        <img
          src={src}
          alt={alt}
          loading="lazy"
          onLoad={() => setStatus('loaded')}
          onError={() => setStatus('error')}
          className={cx(
            'h-full w-full object-cover transition-opacity duration-500',
            status === 'loaded' ? 'opacity-100' : 'opacity-0',
            imgClassName
          )}
        />
      )}
    </div>
  );
}
