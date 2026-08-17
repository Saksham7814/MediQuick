import { createContext, useContext, useEffect, useRef, useState } from 'react';
import Lenis from 'lenis';

const LenisContext = createContext(null);

/**
 * Wraps the app in Lenis for buttery inertia scrolling. Exposes the Lenis
 * instance via context so things like "scroll to top" and the collapsing
 * search can drive smooth programmatic scrolls.
 */
export function SmoothScrollProvider({ children }) {
  const [lenis, setLenis] = useState(null);
  const rafRef = useRef(null);

  useEffect(() => {
    // Respect users who prefer reduced motion — skip smoothing for them.
    const prefersReduced = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches;
    if (prefersReduced) return;

    const instance = new Lenis({
      duration: 1.05,
      // easeOutExpo — long, smooth glide.
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 1.5,
    });
    setLenis(instance);

    const loop = (time) => {
      instance.raf(time);
      rafRef.current = requestAnimationFrame(loop);
    };
    rafRef.current = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(rafRef.current);
      instance.destroy();
    };
  }, []);

  return (
    <LenisContext.Provider value={lenis}>{children}</LenisContext.Provider>
  );
}

export function useLenis() {
  return useContext(LenisContext);
}

/** Convenience: smooth-scroll to the top of the page. */
export function useScrollToTop() {
  const lenis = useLenis();
  return (opts = {}) => {
    if (lenis) lenis.scrollTo(0, { duration: 0.9, ...opts });
    else window.scrollTo({ top: 0, behavior: 'smooth' });
  };
}
