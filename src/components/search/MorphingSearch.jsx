import { useEffect, useRef } from 'react';
import SearchBar from './SearchBar.jsx';
import SearchPill from './SearchPill.jsx';

/**
 * Scroll-driven morph of the home search.
 *
 * A single centred container slides up from under the nav row into the nav row
 * as you scroll. Inside it, the full two-field search bar cross-fades into the
 * compact "Treatments · Hospitals · Doctors" pill — so it doesn't merely shrink,
 * it *converts* into the pill by the time it reaches the top bar. An in-flow
 * spacer collapses in step so the header height shrinks with it.
 *
 * Everything is written straight to the DOM inside a rAF-throttled scroll
 * handler (no React re-render per frame) so it tracks the scroll perfectly.
 */

const COLLAPSE_DISTANCE = 130; // px of scroll to fully convert
const SUB_HEIGHT = 92; // extra header height when expanded
const TRANSLATE_END = -60; // px up into the nav row (centres the pill)

const clamp = (v, min, max) => Math.min(max, Math.max(min, v));

export default function MorphingSearch() {
  const containerRef = useRef(null);
  const expandedRef = useRef(null);
  const pillRef = useRef(null);
  const spacerRef = useRef(null);

  useEffect(() => {
    let frame = 0;

    const apply = () => {
      const p = clamp(window.scrollY / COLLAPSE_DISTANCE, 0, 1);

      // Container slides up into the nav row.
      if (containerRef.current) {
        containerRef.current.style.transform = `translateX(-50%) translateY(${
          TRANSLATE_END * p
        }px)`;
      }

      // Full search bar fades/shrinks out over the first half.
      if (expandedRef.current) {
        const o = clamp(1 - p / 0.5, 0, 1);
        expandedRef.current.style.opacity = String(o);
        expandedRef.current.style.transform = `scale(${1 - 0.06 * p})`;
        expandedRef.current.style.pointerEvents = p < 0.4 ? 'auto' : 'none';
      }

      // Compact pill fades/grows in over the second half.
      if (pillRef.current) {
        const o = clamp((p - 0.5) / 0.5, 0, 1);
        pillRef.current.style.opacity = String(o);
        pillRef.current.style.transform = `translateX(-50%) scale(${0.94 + 0.06 * p})`;
        pillRef.current.style.pointerEvents = p > 0.6 ? 'auto' : 'none';
      }

      // Header height collapses along with the transition.
      if (spacerRef.current) {
        spacerRef.current.style.height = `${SUB_HEIGHT * (1 - p)}px`;
      }

      frame = 0;
    };

    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(apply);
    };

    apply();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', onScroll);
      if (frame) cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <div className="relative">
      {/* In-flow spacer: collapses as you scroll, shrinking the header. */}
      <div ref={spacerRef} style={{ height: SUB_HEIGHT }} />

      {/* Morphing container (out of flow, centred, slides up on scroll). */}
      <div
        ref={containerRef}
        className="pointer-events-none absolute left-1/2 top-1"
        style={{ transform: 'translateX(-50%)', willChange: 'transform' }}
      >
        {/* Layer 1: full search bar (defines the container size). */}
        <div
          ref={expandedRef}
          className="w-[92vw] max-w-2xl"
          style={{ transformOrigin: 'top center', willChange: 'transform, opacity' }}
        >
          <SearchBar />
        </div>

        {/* Layer 2: compact pill (overlaid, centred, hidden until scrolled). */}
        <div
          ref={pillRef}
          className="absolute left-1/2 top-0.5"
          style={{
            transform: 'translateX(-50%)',
            transformOrigin: 'top center',
            opacity: 0,
            pointerEvents: 'none',
            willChange: 'transform, opacity',
          }}
        >
          <SearchPill />
        </div>
      </div>
    </div>
  );
}
