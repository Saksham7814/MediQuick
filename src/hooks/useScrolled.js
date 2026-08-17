import { useEffect, useState } from 'react';

/**
 * Returns true once the page is scrolled past `threshold` pixels.
 * Used to drive the navbar's collapsing search transition.
 */
export function useScrolled(threshold = 24) {
  const [scrolled, setScrolled] = useState(
    typeof window !== 'undefined' && window.scrollY > threshold
  );

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > threshold);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [threshold]);

  return scrolled;
}
