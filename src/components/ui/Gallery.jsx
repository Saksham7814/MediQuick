import { useState } from 'react';
import SmartImage from './SmartImage.jsx';
import Icon from './Icon.jsx';
import { cx } from '../../utils/format.js';

/**
 * Image gallery: a large primary image with a thumbnail strip, plus a simple
 * lightbox on click. Used on hospital/clinic detail pages.
 */
export default function Gallery({ images = [], alt = '' }) {
  const [active, setActive] = useState(0);
  const [lightbox, setLightbox] = useState(false);

  if (images.length === 0) return null;

  return (
    <>
      <div className="grid gap-3 sm:grid-cols-[2fr_1fr]">
        <button
          onClick={() => setLightbox(true)}
          className="overflow-hidden rounded-2xl"
          aria-label="Open image"
        >
          <SmartImage
            src={images[active]}
            alt={alt}
            aspect="aspect-[16/10]"
            imgClassName="transition-transform duration-500 hover:scale-[1.02]"
          />
        </button>
        <div className="grid grid-cols-4 gap-3 sm:grid-cols-2">
          {images.slice(0, 4).map((src, i) => (
            <button
              key={i}
              onClick={() => setActive(i)}
              className={cx(
                'overflow-hidden rounded-xl ring-2 ring-transparent transition-all',
                i === active && 'ring-brand-500'
              )}
              aria-label={`View image ${i + 1}`}
            >
              <SmartImage src={src} alt="" aspect="aspect-[4/3] sm:aspect-[16/10]" />
            </button>
          ))}
        </div>
      </div>

      {lightbox && (
        <div
          className="fixed inset-0 z-[70] flex items-center justify-center bg-ink-950/90 p-4 animate-fade-in"
          onClick={() => setLightbox(false)}
        >
          <button
            className="absolute right-5 top-5 flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20"
            aria-label="Close"
          >
            <Icon name="x" />
          </button>
          <img
            src={images[active]}
            alt={alt}
            className="max-h-[85vh] max-w-5xl rounded-2xl object-contain"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}
    </>
  );
}
